// PATH: frontend/src/pages/consultancies/shared/consultancyApi.js

const BASE_URL = "http://localhost:5000/api/consultancy";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// ---- Acceptance Forms ----
export const createAcceptanceForm = (payload) =>
  request("/acceptance-forms", { method: "POST", body: JSON.stringify(payload) });

export const fetchAcceptanceForms = (campus, status) => {
  const params = new URLSearchParams({ campus });
  if (status && status !== "all") params.set("status", status);
  return request(`/acceptance-forms?${params.toString()}`);
};

export const fetchAcceptanceFormDetail = (idOrCode) =>
  request(`/acceptance-forms/${idOrCode}`);

export const updateAcceptanceFormStatus = (idOrCode, status, remarks) =>
  request(`/acceptance-forms/${idOrCode}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, remarks }),
  });

// ---- Installments ----
export const fetchInstallmentForms = (campus) =>
  request(`/installments?campus=${campus}`);

export const addInstallment = (idOrCode, payload) =>
  request(`/installments/${idOrCode}`, { method: "POST", body: JSON.stringify(payload) });

// ---- Invoices ----
export const fetchInvoices = (campus, status) => {
  const params = new URLSearchParams({ campus });
  if (status && status !== "all") params.set("status", status);
  return request(`/invoices?${params.toString()}`);
};

export const markInvoiceCompleted = (idOrCode, invoiceNo) =>
  request(`/invoices/${idOrCode}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ invoiceNo }),
  });

// ---- Payments ----
export const fetchPayments = (campus, status) => {
  const params = new URLSearchParams({ campus });
  if (status && status !== "all") params.set("status", status);
  return request(`/payments?${params.toString()}`);
};

export const savePayment = (idOrCode, payload) =>
  request(`/payments/${idOrCode}`, { method: "POST", body: JSON.stringify(payload) });

export const uploadFirmLetter = (idOrCode, file) => {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();
  formData.append("firmLetter", file);
  return fetch(`${BASE_URL}/acceptance-forms/${idOrCode}/firm-letter`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData, // no Content-Type header — browser sets multipart boundary
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`);
    return data;
  });
};

export const fileUrl = (path) => `http://localhost:5000${path}`;