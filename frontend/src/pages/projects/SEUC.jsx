import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./SEUC.css";


export default function SEUC() {
  const reportRef = useRef();

  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const agencies = [
{
  id: "dbt",
  name: "DBT",
  formats: [
    {
      id: "dbt-f1",
      name: "Statement of Expenditure",
      component: Format1,
    },
    {
      id: "dbt-f2",
      name: "Utilization Certificate",
      component: Format1,
    },
  ],
},

    {
  id: "serb",
  name: "SERB",
  formats: [
    {
      id: "pse",
      name: "PSE",
      component: PSE,
    },
    {
      id: "tsa_pfms",
      name: "TSA PFMS",
      component: TSAPFMS,
    },
    {
      id: "ucn",
      name: "UC Non-Recurring",
      component: UCN,
    },
    {
      id: "ucr",
      name: "UC Recurring",
      component: UCR,
    },
  ],
},

    {
      id: "drdo",
      name: "DRDO",
      formats: [
        {
          id: "drdo-f1",
          name: "Format 1",
          component: Format1,
        },
      ],
    },

    {
      id: "isro",
      name: "ISRO",
      formats: [
        {
          id: "isro-f1",
          name: "Format 1",
          component: Format1,
        },
      ],
    },

    {
      id: "csir",
      name: "CSIR",
      formats: [
        {
          id: "csir-f1",
          name: "Format 1",
          component: Format1,
        },
      ],
    },

    {
      id: "icssr",
      name: "ICSSR",
      formats: [
        {
          id: "icssr-f1",
          name: "Format 1",
          component: Format1,
        },
      ],
    },
  ];

 const projects = [
  {
    id: 1,
    agency: "dbt",
    projectNo: "CSRC/2025/001",
    title: "AI Based Crop Monitoring",
    pi: "Dr. John",
    amount: "₹5,00,000",
  },

  {
    id: 2,
    agency: "dbt",
    projectNo: "CSRC/2025/002",
    title: "Smart Irrigation System",
    pi: "Dr. David",
    amount: "₹8,50,000",
  },

  {
    id: 3,
    agency: "serb",
    projectNo: "CSRC/2025/003",
    title: "Renewable Energy Study",
    pi: "Dr. Smith",
    amount: "₹12,00,000",
  },
];

  const agencyProjects = projects.filter(
    (project) => project.agency === selectedAgency?.id
  );

  const downloadPDF = () => {
    const element = reportRef.current;

    html2pdf()
      .set({
        margin: 0.3,
        filename: `${selectedProject?.projectNo}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  const SelectedComponent = selectedFormat?.component;

  return (
    <div className="seuc-page">
      <h1 className="page-title">
        Statement of Expenditure & Utilization Certificate
      </h1>

      {/* STEP 1 : FUNDING AGENCY */}

      {!selectedAgency && (
        <>
          <h2 className="section-title">
            Select Funding Agency
          </h2>

          <div className="format-grid">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                className="format-card"
                onClick={() => setSelectedAgency(agency)}
              >
                <div className="format-icon">🏛️</div>

                <h3>{agency.name}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      {/* STEP 2 : PROJECT */}

      {selectedAgency && !selectedProject && (
        <>
          <div className="top-bar">
            <button
              className="back-btn"
              onClick={() => setSelectedAgency(null)}
            >
              ← Agencies
            </button>
          </div>

          <h2 className="section-title">
            Select Project
          </h2>

          <div className="project-grid">
            {agencyProjects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <h3>{project.title}</h3>

                <p>
                  <strong>Project No:</strong>{" "}
                  {project.projectNo}
                </p>

                <p>
                  <strong>PI:</strong>{" "}
                  {project.pi}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  {project.amount}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* STEP 3 : FORMAT */}

      {selectedAgency &&
        selectedProject &&
        !selectedFormat && (
          <>
            <div className="top-bar">
              <button
                className="back-btn"
                onClick={() => setSelectedProject(null)}
              >
                ← Projects
              </button>
            </div>

            <h2 className="section-title">
              Select Format
            </h2>

            <div className="format-grid">
              {selectedAgency.formats.map((format) => (
                <div
                  key={format.id}
                  className="format-card"
                  onClick={() => setSelectedFormat(format)}
                >
                  <div className="format-icon">
                    📄
                  </div>

                  <h3>{format.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}

      {/* STEP 4 : PREVIEW */}

      {selectedAgency &&
        selectedProject &&
        selectedFormat && (
          <>
            <div className="action-bar">
              <button
                className="back-btn"
                onClick={() => setSelectedFormat(null)}
              >
                ← Formats
              </button>

              <button
                className="download-btn"
                onClick={downloadPDF}
              >
                Download PDF
              </button>
            </div>

            <div
              ref={reportRef}
              className="report-container"
            >
              <SelectedComponent
                project={selectedProject}
              />
            </div>
          </>
        )}
    </div>
  );
}