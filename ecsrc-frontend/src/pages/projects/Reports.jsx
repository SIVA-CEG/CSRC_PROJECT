import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./Reports.css";

const fundingAgency = [
    {
      "text": "281/Arch/22231306",
      "value": "281/Arch/22231306"
    },
    {
      "text": "Additional Director General of Police Operations, Chennai {ADGPO}",
      "value": "Additional Director General of Police Operations, Chennai {ADGPO}"
    },
    {
      "text": "Additional Principal Chief Conservator of Forests & Chief Project Director, TBGPCCR, Chennai",
      "value": "Additional Principal Chief Conservator of Forests & Chief Project Director, TBGPCCR, Chennai"
    },
    {
      "text": "AERB",
      "value": "AERB"
    },
    {
      "text": "Aeronautics Research and Development Board, DRDO {ARDB-DRDO}",
      "value": "Aeronautics Research and Development Board, DRDO {ARDB-DRDO}"
    },
    {
      "text": "All India Council for Technical Education, New Delhi {AICTU}",
      "value": "All India Council for Technical Education, New Delhi {AICTU}"
    },
    {
      "text": "All IndiaCouncil for Technical Education, New Delhi {AICTE}",
      "value": "All IndiaCouncil for Technical Education, New Delhi {AICTE}"
    },
    {
      "text": "Anusandhan National Research Foundation (ANRF)",
      "value": "Anusandhan National Research Foundation (ANRF)"
    },
    {
      "text": "ATOMIC ENERGY RECULATORY BOARD{AERB}",
      "value": "ATOMIC ENERGY RECULATORY BOARD{AERB}"
    },
    {
      "text": "AU - CFR - Seed Research Grant",
      "value": "AU - CFR - Seed Research Grant"
    },
    {
      "text": "Bharat Electronics",
      "value": "Bharat Electronics"
    },
    {
      "text": "Bharat Electronics Limited (BEL)",
      "value": "Bharat Electronics Limited (BEL)"
    },
    {
      "text": "Biotechnology Industry Research Assistance Council,New Delhi {BIRAC}",
      "value": "Biotechnology Industry Research Assistance Council,New Delhi {BIRAC}"
    },
    {
      "text": "Board of Research in Nuclear Sciences (BRNS)",
      "value": "Board of Research in Nuclear Sciences (BRNS)"
    },
    {
      "text": "Board of Research in Nuclear Sciences {BRNS}",
      "value": "Board of Research in Nuclear Sciences {BRNS}"
    },
    {
      "text": "British Council Division",
      "value": "British Council Division"
    },
    {
      "text": "Building materials and Technology Promotion Council",
      "value": "Building materials and Technology Promotion Council"
    },
    {
      "text": "Central Institute of Coir Technology, CIOR Board, Ministry of MSME, Government of India, Bengaluru",
      "value": "Central Institute of Coir Technology, CIOR Board, Ministry of MSME, Government of India, Bengaluru"
    },
    {
      "text": "Central Mine Planning & Design Institute Limited {}",
      "value": "Central Mine Planning & Design Institute Limited {}"
    },
    {
      "text": "Central Power Research Institute (CPRI)",
      "value": "Central Power Research Institute (CPRI)"
    },
    {
      "text": "Central Silk Board, Ministry of Textiles, Government of India {CSB}",
      "value": "Central Silk Board, Ministry of Textiles, Government of India {CSB}"
    },
    {
      "text": "Centre for Global Equality Limited (CGE)",
      "value": "Centre for Global Equality Limited (CGE)"
    },
    {
      "text": "Centre of Excellence in Trasportation Engineering (CETransE)",
      "value": "Centre of Excellence in Trasportation Engineering (CETransE)"
    },
    {
      "text": "Chennai Metropolitan Water Supply and Sewerage Board {CMWSSB}",
      "value": "Chennai Metropolitan Water Supply and Sewerage Board {CMWSSB}"
    },
    {
      "text": "Chief Minister Research Grant, Directorate of Technical Education{CMRG}",
      "value": "Chief Minister Research Grant, Directorate of Technical Education{CMRG}"
    },
    {
      "text": "Chief Minister’s Research Grant, Directorate of Technical Education",
      "value": "Chief Minister’s Research Grant, Directorate of Technical Education"
    },
    {
      "text": "Combat Vehicles Research & Development Establishment, Avadi {CVRDE}",
      "value": "Combat Vehicles Research & Development Establishment, Avadi {CVRDE}"
    },
    {
      "text": "Contract for Acquistion of Research Services (CARS)",
      "value": "Contract for Acquistion of Research Services (CARS)"
    },
    {
      "text": "Corporation of Chennai",
      "value": "Corporation  of Chennai"
    },
    {
      "text": "Council of Scientific and Industrial Research,New Delhi {CSIR}",
      "value": "Council of Scientific and Industrial Research,New Delhi {CSIR}"
    },
    {
      "text": "CSIR",
      "value": "CSIR"
    },
    {
      "text": "DARL",
      "value": "DARL"
    },
    {
      "text": "DBT",
      "value": "DBT"
    },
    {
      "text": "Defence Bio Engineering & Electromedical Laboratory, Bangalore {DEBEL}",
      "value": "Defence Bio Engineering & Electromedical Laboratory, Bangalore {DEBEL}"
    },
    {
      "text": "Defence Research & Development Organisation, Life Sciences Research Board, (DRDO-LSRB)",
      "value": "Defence Research & Development Organisation, Life Sciences Research Board, (DRDO-LSRB)"
    },
    {
      "text": "Defence Research and Development Laboratory{DRDL}",
      "value": "Defence Research and Development Laboratory{DRDL}"
    },
    {
      "text": "Defence Research and Development Organisation , Hyderabad",
      "value": "Defence Research and Development Organisation , Hyderabad"
    },
    {
      "text": "Defence Research and Development Organisation,New Delhi {DRDO}",
      "value": "Defence Research and Development Organisation,New Delhi {DRDO}"
    },
    {
      "text": "Department of Atomic Energy",
      "value": "Department of Atomic Energy"
    },
    {
      "text": "Department of Atomic Energy, Indira Gandhi Centre for Atomic Research {DAE, IGCAR}",
      "value": "Department of Atomic Energy, Indira Gandhi Centre for Atomic Research {DAE, IGCAR}"
    },
    {
      "text": "Department of Biotechnology, New Delhi {DBT}",
      "value": "Department of Biotechnology, New Delhi {DBT}"
    },
    {
      "text": "Department of Education in Science and Mathematics",
      "value": "Department of Education in Science and Mathematics"
    },
    {
      "text": "Department of Electronics and Information Technology, New Delhi {DIT}",
      "value": "Department of Electronics and Information Technology, New Delhi {DIT}"
    },
    {
      "text": "Department of Environment and Climate Change, Government of Tamilnadu {DoE&CC}",
      "value": "Department of Environment and Climate Change, Government of Tamilnadu {DoE&CC}"
    },
    {
      "text": "Department of Environment, Chennai {DOE}",
      "value": "Department of Environment, Chennai {DOE}"
    },
    {
      "text": "Department of Health Research, New Delhi {DHR}",
      "value": "Department of Health Research, New Delhi {DHR}"
    },
    {
      "text": "Department of Informanrion Technology",
      "value": "Department of Informanrion Technology"
    },
    {
      "text": "Department of Information Technology",
      "value": "Department of Information Technology"
    },
    {
      "text": "Department of Integrated Child Development Services",
      "value": "Department of Integrated Child Development Services"
    },
    {
      "text": "Department of Land Resources of Ministry of Rural Development, Government of India",
      "value": "Department of Land Resources of Ministry of Rural Development, Government of India"
    },
    {
      "text": "Department of Science and Technology",
      "value": "Department of Science and Technology"
    },
    {
      "text": "Department of Science and Technology, New Delhi {DST}",
      "value": "Department of Science and Technology, New Delhi {DST}"
    },
    {
      "text": "Department of Water Resources, RD & GR",
      "value": "Department of Water Resources, RD & GR"
    },
    {
      "text": "Deutsche Gesellschaft fur Internationale Zusammenarbeit (GIZ) GMBH",
      "value": "Deutsche Gesellschaft fur Internationale Zusammenarbeit (GIZ) GMBH"
    },
    {
      "text": "Development of bio Technology (DPT)",
      "value": "Development of bio Technology (DPT)"
    },
    {
      "text": "Development of Rural Development and Panchayat Raj",
      "value": "Development of Rural Development and Panchayat Raj"
    },
    {
      "text": "Dhaksha Unmanned Systems Private Limited",
      "value": "Dhaksha Unmanned Systems Private Limited"
    },
    {
      "text": "Directorate of Technical Education (DoTE), Chennai",
      "value": "Directorate of Technical Education (DoTE), Chennai"
    },
    {
      "text": "Directorate of Technical Education, Chennai (DOTE)",
      "value": "Directorate of Technical Education, Chennai (DOTE)"
    },
    {
      "text": "Disaster Management and Mitigation Department,Chennai {DMMD}",
      "value": "Disaster Management and Mitigation Department,Chennai {DMMD}"
    },
    {
      "text": "District Collectorate, Thoothukudi {}",
      "value": "District Collectorate, Thoothukudi {}"
    },
    {
      "text": "District Rural Development Agency",
      "value": "District Rural Development Agency"
    },
    {
      "text": "DIT",
      "value": "DIT"
    },
    {
      "text": "Divisional Forest Officer, Odisha {}",
      "value": "Divisional Forest Officer, Odisha {}"
    },
    {
      "text": "DRDE",
      "value": "DRDE"
    },
    {
      "text": "DRDO",
      "value": "DRDO"
    },
    {
      "text": "DST",
      "value": "DST"
    },
    {
      "text": "DST (NRDMS)",
      "value": "DST (NRDMS)"
    },
    {
      "text": "DST Climate Change and Clean Energy",
      "value": "DST Climate Change and Clean Energy"
    },
    {
      "text": "DST SERB",
      "value": "DST SERB"
    },
    {
      "text": "DST-SERB {}",
      "value": "DST-SERB {}"
    },
    {
      "text": "DST-SNSF",
      "value": "DST-SNSF"
    },
    {
      "text": "DST-TDB",
      "value": "DST-TDB"
    },
    {
      "text": "DST-TDP-BDTD",
      "value": "DST-TDP-BDTD"
    },
    {
      "text": "DST-UK-India Education and Research Initiative{UKIERI}",
      "value": "DST-UK-India Education and Research Initiative{UKIERI}"
    },
    {
      "text": "ERASMUS-EDU",
      "value": "ERASMUS-EDU"
    },
    {
      "text": "Eropean Commission (EC)",
      "value": "Eropean Commission (EC)"
    },
    {
      "text": "European Union Collaboration, Switzerland",
      "value": "European Union Collaboration, Switzerland"
    },
    {
      "text": "Exnora International Foundation, Chennai",
      "value": "Exnora International Foundation, Chennai"
    },
    {
      "text": "Gandhigram Rural Institute {GRI}",
      "value": "Gandhigram Rural Institute {GRI}"
    },
    {
      "text": "Government of India , Ministry of Housing & Urban Affairs",
      "value": "Government of India , Ministry of Housing & Urban Affairs"
    },
    {
      "text": "Government of Tamil Nadu of Sub Divisional Magistrate & Sub Collector, Kumbakonam {SDM & SC,Kumbakonam}",
      "value": "Government of Tamil Nadu of Sub Divisional Magistrate & Sub Collector, Kumbakonam {SDM & SC,Kumbakonam}"
    },
    {
      "text": "GOVT . OF WEST BENGAL, OFFICE OF THE COMMISIONER OF POLICE KOLKOTA",
      "value": "GOVT . OF WEST BENGAL, OFFICE OF THE COMMISIONER OF POLICE KOLKOTA"
    },
    {
      "text": "Greater Chennai Coporation {GCC}",
      "value": "Greater Chennai Coporation {GCC}"
    },
    {
      "text": "Higher Education (l1) Department, Government of Tamil Nadu {TANII}",
      "value": "Higher Education (l1) Department, Government of Tamil Nadu {TANII}"
    },
    {
      "text": "Higher Education (l1) Department, Government of Tamil Nadu {}",
      "value": "Higher Education (l1) Department, Government of Tamil Nadu {}"
    },
    {
      "text": "Hitachi India Private Limited, Bengaluru",
      "value": "Hitachi India Private Limited, Bengaluru"
    },
    {
      "text": "ICMR",
      "value": "ICMR"
    },
    {
      "text": "IGSTC{}",
      "value": "IGSTC{}"
    },
    {
      "text": "Indian Council for Medical Research,New Delhi {ICMR}",
      "value": "Indian Council for Medical Research,New Delhi {ICMR}"
    },
    {
      "text": "Indian Council of Agricultural Research {ICAR}",
      "value": "Indian Council of Agricultural Research {ICAR}"
    },
    {
      "text": "Indian Council of Social Science Research, New Delhi {ICSSR}",
      "value": "Indian Council of Social Science Research, New Delhi {ICSSR}"
    },
    {
      "text": "Indian Council of Social Sciene Research, New Delhi ICSSR {}",
      "value": "Indian Council of Social Sciene Research, New Delhi ICSSR {}"
    },
    {
      "text": "Indian Institue Of Chemical Engineers, Kolkata {IIChE}",
      "value": "Indian Institue Of Chemical Engineers, Kolkata {IIChE}"
    },
    {
      "text": "Indian Institute of Technology, Madras",
      "value": "Indian Institute of Technology, Madras"
    },
    {
      "text": "Indian National Centre for Ocean Information Services",
      "value": "Indian National Centre for Ocean Information Services"
    },
    {
      "text": "Indian Rubber Manufacturers Research Association (IRMRA)",
      "value": "Indian Rubber Manufacturers Research Association (IRMRA)"
    },
    {
      "text": "Indian Space Research Organization {ISRO}",
      "value": "Indian Space Research Organization {ISRO}"
    },
    {
      "text": "Indian Space Research Organization, Department of Space {ISRO-DoS}",
      "value": "Indian Space Research Organization, Department of Space {ISRO-DoS}"
    },
    {
      "text": "Indira Gandhi Centre for Atomic Research",
      "value": "Indira Gandhi Centre for Atomic Research"
    },
    {
      "text": "Indo French Centre for the promotion of Advanced Research",
      "value": "Indo French Centre for the promotion of Advanced Research"
    },
    {
      "text": "Institute for Housing and Urban Development Studies, Erasmus University Rotterdam",
      "value": "Institute for Housing and Urban Development Studies, Erasmus University Rotterdam"
    },
    {
      "text": "Institute for Hydraulics & hydrology, Poondi",
      "value": "Institute for Hydraulics & hydrology, Poondi"
    },
    {
      "text": "Institute of Hdraulics & hydrology, Poondi",
      "value": "Institute of Hdraulics & hydrology, Poondi"
    },
    {
      "text": "Inter-University Accelerator Centre, New Delhi {IUAC}",
      "value": "Inter-University Accelerator Centre, New Delhi {IUAC}"
    },
    {
      "text": "International Institute of information Technology, Hyderabad {IIIT-H}",
      "value": "International Institute of information Technology, Hyderabad {IIIT-H}"
    },
    {
      "text": "Irrigation Management Training Institute( IMTI)",
      "value": "Irrigation Management Training Institute( IMTI)"
    },
    {
      "text": "Jawaharlal Nehru Aluminium Research Development & Design Centre",
      "value": "Jawaharlal Nehru Aluminium Research Development & Design Centre"
    },
    {
      "text": "Kerala State Remote Sensing and Environment Centre {}",
      "value": "Kerala State Remote Sensing and Environment Centre {}"
    },
    {
      "text": "La Fondation - Dassault Systemes Foundation, Mumbai, India {}",
      "value": "La Fondation - Dassault Systemes Foundation, Mumbai, India {}"
    },
    {
      "text": "Larsen & Tourbo Lt., Construction",
      "value": "Larsen & Tourbo Lt., Construction"
    },
    {
      "text": "Larsen& Tourbro Limited Construction {L& T], Chennai",
      "value": "Larsen& Tourbro Limited Construction {L& T], Chennai"
    },
    {
      "text": "Lucid Software Limited, Chennai",
      "value": "Lucid Software Limited, Chennai"
    },
    {
      "text": "M/s Dhaksha Unmanned Systems Pvt Ltd",
      "value": "M/s Dhaksha Unmanned Systems Pvt Ltd"
    },
    {
      "text": "M/s VATECH Wabag Ltd",
      "value": "M/s VATECH Wabag Ltd"
    },
    {
      "text": "M/s. Welkinrim Technologies Pvt.Ltd, Chennai",
      "value": "M/s. Welkinrim Technologies Pvt.Ltd, Chennai"
    },
    {
      "text": "Madras Fertilizers Limited",
      "value": "Madras Fertilizers Limited"
    },
    {
      "text": "MeraYuva Bharat (MY Bharat) Section, Department of Youth Affairs, Ministry of Youth Affairs & Sports",
      "value": "MeraYuva Bharat (MY Bharat) Section, Department of Youth Affairs, Ministry of Youth Affairs & Sports"
    },
    {
      "text": "Microsoft",
      "value": "Microsoft"
    },
    {
      "text": "Ministry of Communication and Information Technology",
      "value": "Ministry of Communication and Information Technology"
    },
    {
      "text": "Ministry of Earth Sciences",
      "value": "Ministry of Earth Sciences"
    },
    {
      "text": "Ministry of Electronics & Information Technology, New Delhi {MeitY}",
      "value": "Ministry of Electronics & Information Technology, New Delhi {MeitY}"
    },
    {
      "text": "Ministry of Food Processing Industies {MoFPI}",
      "value": "Ministry of Food Processing Industies {MoFPI}"
    },
    {
      "text": "Ministry of Health and Family Welfare {MHFW}",
      "value": "Ministry of Health and Family Welfare {MHFW}"
    },
    {
      "text": "Ministry of Health and Family Welfare, New Delhi {MoHFW}",
      "value": "Ministry of Health and Family Welfare, New Delhi {MoHFW}"
    },
    {
      "text": "Ministry of Housing and Urban Affairs",
      "value": "Ministry of Housing and Urban Affairs"
    },
    {
      "text": "Ministry of Human Resource Development, Indian Institute of Science, Bangalore {MHRD}",
      "value": "Ministry of Human Resource Development, Indian Institute of Science, Bangalore {MHRD}"
    },
    {
      "text": "Ministry Of Mines{}",
      "value": "Ministry Of Mines{}"
    },
    {
      "text": "Ministry of New & Renewable energy Wind Energy Division",
      "value": "Ministry of New & Renewable energy Wind Energy Division"
    },
    {
      "text": "Ministry of New and Renewable Energy {MNRE}",
      "value": "Ministry of New and Renewable Energy {MNRE}"
    },
    {
      "text": "Ministry of Panchayati Raj, New Delhi {MoPR}",
      "value": "Ministry of Panchayati Raj, New Delhi {MoPR}"
    },
    {
      "text": "Ministry of Water Resources { MoWR }",
      "value": "Ministry of Water Resources { MoWR }"
    },
    {
      "text": "MOEF",
      "value": "MOEF"
    },
    {
      "text": "NALCO",
      "value": "NALCO"
    },
    {
      "text": "National Agricultural Science Fund, New Delhi {NASF}",
      "value": "National Agricultural Science Fund, New Delhi {NASF}"
    },
    {
      "text": "National Center for Earth Science Studies (NCESS)",
      "value": "National Center for Earth Science Studies (NCESS)"
    },
    {
      "text": "National Center for Earth Science Studies {NCESS}",
      "value": "National Center for Earth Science Studies {NCESS}"
    },
    {
      "text": "National Centre for Coastal Research, Pallikaranai, Chennai {NCCR}",
      "value": "National Centre for Coastal Research, Pallikaranai, Chennai {NCCR}"
    },
    {
      "text": "National Disaster Management Authority, New Delhi {NDMA}",
      "value": "National Disaster Management Authority, New Delhi {NDMA}"
    },
    {
      "text": "National Initiative of Climate Resilient Agriculture (NICRA), Hyderabad",
      "value": "National Initiative of Climate Resilient Agriculture (NICRA), Hyderabad"
    },
    {
      "text": "National Institute of Ocean Technology {NIOT}",
      "value": "National Institute of Ocean Technology {NIOT}"
    },
    {
      "text": "National Institute of Urban Affairs, New Delhi {NIUA}",
      "value": "National Institute of Urban Affairs, New Delhi {NIUA}"
    },
    {
      "text": "National Medicinal Plants Board {NMPB}",
      "value": "National Medicinal Plants Board {NMPB}"
    },
    {
      "text": "National Remote Sensing Centre (NRSC), Departmenrt of Space, Indian Space Research Organisation (ISRO)",
      "value": "National Remote Sensing  Centre (NRSC), Departmenrt of Space, Indian Space Research Organisation (ISRO)"
    },
    {
      "text": "National Remote Sensing Centre",
      "value": "National Remote Sensing Centre"
    },
    {
      "text": "National Remote Sensing Centre {NRSC}",
      "value": "National Remote Sensing Centre {NRSC}"
    },
    {
      "text": "National Remote Sensing Centre, Department of Space (DOS)",
      "value": "National Remote Sensing Centre, Department of Space (DOS)"
    },
    {
      "text": "NIOT",
      "value": "NIOT"
    },
    {
      "text": "NLC India Limited",
      "value": "NLC India Limited"
    },
    {
      "text": "North Eastern Space Application Centre{NESAC}",
      "value": "North Eastern Space Application Centre{NESAC}"
    },
    {
      "text": "Office of the Accountant General (Audit-II), West Bengal",
      "value": "Office of the Accountant General (Audit-II), West Bengal"
    },
    {
      "text": "Office of the Principal Accountant General (Audit-II), Odisha {}",
      "value": "Office of the Principal Accountant General (Audit-II), Odisha {}"
    },
    {
      "text": "Panasonic India Private Limited , (ATRL) Advanced Technology Research Laboratories , Japan, Govenment of India, Haryana",
      "value": "Panasonic India Private Limited , (ATRL) Advanced Technology Research Laboratories , Japan, Govenment of India, Haryana"
    },
    {
      "text": "Petroleum Institute, Abu Dhabi-UAE",
      "value": "Petroleum Institute, Abu Dhabi-UAE"
    },
    {
      "text": "REGIONAL CENTRE FOR BIOTECHNOLOGY",
      "value": "REGIONAL CENTRE FOR BIOTECHNOLOGY"
    },
    {
      "text": "Revenue & Disaster Management Department {RDMD}",
      "value": "Revenue & Disaster Management Department {RDMD}"
    },
    {
      "text": "Revenue & Disaster Management Department, Chennai {RDMD}",
      "value": "Revenue & Disaster Management Department, Chennai {RDMD}"
    },
    {
      "text": "Scheme For Transformational And Advanced Research In Sciences - STARS",
      "value": "Scheme For Transformational And Advanced Research In Sciences - STARS"
    },
    {
      "text": "Science and Engineering Research Board, New Delhi {SERB}",
      "value": "Science and Engineering Research Board, New Delhi {SERB}"
    },
    {
      "text": "SERB",
      "value": "SERB"
    },
    {
      "text": "Space Application Centre, Ahmedabad{}",
      "value": "Space Application Centre, Ahmedabad{}"
    },
    {
      "text": "Space Application Centre, ISRO",
      "value": "Space Application Centre, ISRO"
    },
    {
      "text": "spc",
      "value": "spc"
    },
    {
      "text": "state banking commission",
      "value": "state banking commission"
    },
    {
      "text": "State Institute of Rural Development & Panchayat Raj",
      "value": "State Institute of Rural Development &  Panchayat Raj"
    },
    {
      "text": "State Planing Commission",
      "value": "State Planing Commission"
    },
    {
      "text": "State Police Chief, Kerala",
      "value": "State Police Chief, Kerala"
    },
    {
      "text": "State Project Director {}",
      "value": "State Project Director {}"
    },
    {
      "text": "State Project Director, RUSA {}",
      "value": "State Project Director, RUSA {}"
    },
    {
      "text": "Supervisory Control and Data Acquisition {SCADA}",
      "value": "Supervisory Control and Data Acquisition {SCADA}"
    },
    {
      "text": "Tamil Nadu Agricultural University, Coimbatore {TNAU}",
      "value": "Tamil Nadu Agricultural University, Coimbatore {TNAU}"
    },
    {
      "text": "Tamil Nadu Biodiversity Conservation and Greening Project",
      "value": "Tamil Nadu Biodiversity Conservation and Greening Project"
    },
    {
      "text": "Tamil Nadu Biodiversity Conservation and Greening Project for Climate Change Response (TBGPCCR)",
      "value": "Tamil Nadu Biodiversity Conservation and Greening Project for Climate Change Response (TBGPCCR)"
    },
    {
      "text": "Tamil Nadu Industrial Department {}",
      "value": "Tamil Nadu Industrial Department {}"
    },
    {
      "text": "Tamil Nadu Innovation Initiatives {TANII}",
      "value": "Tamil Nadu Innovation Initiatives {TANII}"
    },
    {
      "text": "Tamil Nadu Medical Plant Farms & Herbal Medicine Corporation Ltd",
      "value": "Tamil Nadu Medical Plant Farms & Herbal Medicine Corporation Ltd"
    },
    {
      "text": "Tamil Nadu Police Department {TNPD}",
      "value": "Tamil Nadu Police Department {TNPD}"
    },
    {
      "text": "Tamil Nadu Pollution Control Board (TNPCB)",
      "value": "Tamil Nadu Pollution Control Board (TNPCB)"
    },
    {
      "text": "Tamil Nadu Skill Development Corporation",
      "value": "Tamil Nadu Skill Development Corporation"
    },
    {
      "text": "Tamil Nadu State Council for Science and Technology",
      "value": "Tamil Nadu State Council for Science and Technology"
    },
    {
      "text": "Tamil Nadu State Wetland Authority (TNSWA)",
      "value": "Tamil Nadu State Wetland Authority (TNSWA)"
    },
    {
      "text": "TAMIL VIRTUAL ACADEMY",
      "value": "TAMIL VIRTUAL ACADEMY"
    },
    {
      "text": "Tamilnadu Forest Development",
      "value": "Tamilnadu Forest Development"
    },
    {
      "text": "Tamilnadu State Council For Science And Technology,Chennai {TNSCST}",
      "value": "Tamilnadu State Council For Science And Technology,Chennai {TNSCST}"
    },
    {
      "text": "Tamilnadu Uniform Services Recruitment Board (TNUSRB)",
      "value": "Tamilnadu Uniform Services Recruitment Board (TNUSRB)"
    },
    {
      "text": "TATA Steel",
      "value": "TATA Steel"
    },
    {
      "text": "Telecom Centre of Excellence India",
      "value": "Telecom Centre of Excellence India"
    },
    {
      "text": "TEXMiN",
      "value": "TEXMiN"
    },
    {
      "text": "The Combat Vehicles Res. & Dev. Estt., Ministry of Defence, Avadi, Chennai.",
      "value": "The Combat Vehicles Res. & Dev. Estt., Ministry of Defence, Avadi, Chennai."
    },
    {
      "text": "The Corporation of Chennai {COC}",
      "value": "The Corporation of Chennai {COC}"
    },
    {
      "text": "The Council of Scientific and Industrial Research, New Delhi",
      "value": "The Council of Scientific and Industrial Research, New Delhi"
    },
    {
      "text": "The Defence Research and Development Organisation, Hyderabad",
      "value": "The Defence Research and Development Organisation, Hyderabad"
    },
    {
      "text": "The Dhaksha Unmanned Systems Pvt.Ltd",
      "value": "The Dhaksha Unmanned Systems Pvt.Ltd"
    },
    {
      "text": "The Government of Kerala, Planning & Economic Affairs Department, Kerala State Remote Sensing and Environment Centre",
      "value": "The Government of Kerala, Planning & Economic Affairs Department, Kerala State Remote Sensing and Environment Centre"
    },
    {
      "text": "The Indian Institute of Technology, Kharagpur{IIT}",
      "value": "The Indian Institute of Technology, Kharagpur{IIT}"
    },
    {
      "text": "The Institution of Engineers (India), Kolkata {IEI}",
      "value": "The Institution of Engineers (India), Kolkata {IEI}"
    },
    {
      "text": "The Integrated child Development Services Scheme (ICDS)",
      "value": "The Integrated child Development Services Scheme (ICDS)"
    },
    {
      "text": "The Lady Tata Memorial Trust, Government of India, Mumbai",
      "value": "The Lady Tata Memorial Trust, Government of India, Mumbai"
    },
    {
      "text": "The Loughborough University",
      "value": "The Loughborough University"
    },
    {
      "text": "The Ministry of Human Resourse Developement {MHRD }",
      "value": "The Ministry of Human Resourse Developement {MHRD }"
    },
    {
      "text": "The Ministry of Rural Health Development (MHRD)",
      "value": "The Ministry of Rural Health Development (MHRD)"
    },
    {
      "text": "The National Remote sensing Centre (NRSC), ISRO, Hyderabad",
      "value": "The National Remote sensing Centre (NRSC), ISRO, Hyderabad"
    },
    {
      "text": "The University Grants Commission, Government of India, New Delhi",
      "value": "The University Grants Commission, Government of India, New Delhi"
    },
    {
      "text": "TIH Foundation for IoT & IoE",
      "value": "TIH Foundation for IoT & IoE"
    },
    {
      "text": "Triveni Earth Movers",
      "value": "Triveni Earth Movers"
    },
    {
      "text": "UGC",
      "value": "UGC"
    },
    {
      "text": "UGC - DAE - CSR, New Delhi",
      "value": "UGC - DAE - CSR, New Delhi"
    },
    {
      "text": "UGC - DAE - CSR, New Delhi {}",
      "value": "UGC - DAE - CSR, New Delhi {}"
    },
    {
      "text": "UGC - DAE Consortium for Scientific Research, New Delhi {UGC - DAE CSR}",
      "value": "UGC - DAE Consortium for Scientific Research, New Delhi {UGC - DAE CSR}"
    },
    {
      "text": "UGC - India-New Zealand Education Council INZEC Joint project",
      "value": "UGC - India-New Zealand Education Council INZEC Joint project"
    },
    {
      "text": "UGC-DAE Consortium for Scientific Research, Indore {UGC-DAE-CSR}",
      "value": "UGC-DAE Consortium for Scientific Research, Indore {UGC-DAE-CSR}"
    },
    {
      "text": "UGC-DAE Consortium for Scientific Research, Mumbai {UGC-DAE-CSR}",
      "value": "UGC-DAE Consortium for Scientific Research, Mumbai {UGC-DAE-CSR}"
    },
    {
      "text": "Unilever industries pvt.ltd",
      "value": "Unilever industries pvt.ltd"
    },
    {
      "text": "UNITED NATIONS CHILDRENS FUND - UNICEF",
      "value": "UNITED NATIONS CHILDRENS FUND - UNICEF"
    },
    {
      "text": "United Nations International Children Emergency Fund,Chennai {UNICEF}",
      "value": "United Nations International Children Emergency Fund,Chennai {UNICEF}"
    },
    {
      "text": "University Grants Commission - DAE - Consortium for Scientific Research",
      "value": "University Grants Commission - DAE - Consortium for Scientific Research"
    },
    {
      "text": "University Grants Commission, New Delhi {UGC}",
      "value": "University Grants Commission, New Delhi {UGC}"
    },
    {
      "text": "University of Greenwich",
      "value": "University of Greenwich"
    },
    {
      "text": "University of Greenwich{}",
      "value": "University of Greenwich{}"
    },
    {
      "text": "Western Norwar University of Applied Sciences",
      "value": "Western Norwar University of Applied Sciences"
    },
    {
      "text": "Xagrotor Tek Private Limited, Chennai",
      "value": "Xagrotor Tek Private Limited, Chennai"
    }
  ];

const projectScheme = [
    {
      "text": "Advance Research Grant (ARG) Program",
      "value": "Advance Research Grant (ARG) Program"
    },
    {
      "text": "ARG",
      "value": "ARG"
    },
    {
      "text": "ATAL",
      "value": "ATAL"
    },
    {
      "text": "BRNS",
      "value": "BRNS"
    },
    {
      "text": "c2s",
      "value": "c2s"
    },
    {
      "text": "Capacity Building and Human Resources Development",
      "value": "Capacity Building and Human Resources Development"
    },
    {
      "text": "CARS",
      "value": "CARS"
    },
    {
      "text": "Chief Minister Research Grant, Directorate of Technical Education{CMRG}",
      "value": "Chief Minister Research Grant, Directorate of Technical Education{CMRG}"
    },
    {
      "text": "CHIEF MINISTER’S RESEARCH GRANT (CMRG)",
      "value": "CHIEF MINISTER’S RESEARCH GRANT (CMRG)"
    },
    {
      "text": "CHIEF MINISTERS RESEARCH GRANT",
      "value": "CHIEF MINISTERS RESEARCH GRANT"
    },
    {
      "text": "CHIEF MINISTERS RESEARCH GRANT (CMRG)",
      "value": "CHIEF MINISTERS RESEARCH GRANT (CMRG)"
    },
    {
      "text": "Chip to Start up",
      "value": "Chip to Start up"
    },
    {
      "text": "Climate Change Programme {CCP}",
      "value": "Climate Change Programme {CCP}"
    },
    {
      "text": "Coastal Disaster Risk Reduction Project (CDRRP)",
      "value": "Coastal Disaster Risk Reduction Project (CDRRP)"
    },
    {
      "text": "Collaborative Research Scheme {CRS}",
      "value": "Collaborative Research Scheme {CRS}"
    },
    {
      "text": "Collaborative under DST-UKIERI Scheme",
      "value": "Collaborative under DST-UKIERI Scheme"
    },
    {
      "text": "Contruction Project",
      "value": "Contruction Project"
    },
    {
      "text": "Core Research Grant {CRG}",
      "value": "Core Research Grant {CRG}"
    },
    {
      "text": "Covid-19 {}",
      "value": "Covid-19 {}"
    },
    {
      "text": "CPHEEO",
      "value": "CPHEEO"
    },
    {
      "text": "CSIR",
      "value": "CSIR"
    },
    {
      "text": "CSIR-ASPIRE{}",
      "value": "CSIR-ASPIRE{}"
    },
    {
      "text": "CSIR-HRDG EMR-II ASPIRE",
      "value": "CSIR-HRDG EMR-II ASPIRE"
    },
    {
      "text": "CSRP-AERB{Committee for Safety Research Programme}",
      "value": "CSRP-AERB{Committee for Safety Research Programme}"
    },
    {
      "text": "Cyber Security Projects (NCCC & Others)",
      "value": "Cyber Security Projects (NCCC & Others)"
    },
    {
      "text": "Department of Biotechnology",
      "value": "Department of Biotechnology"
    },
    {
      "text": "Department of Horiculture and Plantation {DHP}",
      "value": "Department of Horiculture and Plantation {DHP}"
    },
    {
      "text": "Department of Science and Technology{DST}",
      "value": "Department of Science and Technology{DST}"
    },
    {
      "text": "Department of Space",
      "value": "Department of Space"
    },
    {
      "text": "DRDL CARS Project{}",
      "value": "DRDL CARS Project{}"
    },
    {
      "text": "DRDO Project",
      "value": "DRDO Project"
    },
    {
      "text": "DRDO Project CARS{}",
      "value": "DRDO Project CARS{}"
    },
    {
      "text": "DRS & GIS {}",
      "value": "DRS & GIS {}"
    },
    {
      "text": "DST",
      "value": "DST"
    },
    {
      "text": "DST-FIST Programme{}",
      "value": "DST-FIST Programme{}"
    },
    {
      "text": "DST-NRDMS",
      "value": "DST-NRDMS"
    },
    {
      "text": "Early Career Research Award {ECRA}",
      "value": "Early Career Research Award {ECRA}"
    },
    {
      "text": "Early Career Research Award {}",
      "value": "Early Career Research Award {}"
    },
    {
      "text": "Empowering Youth for Undertaking Value Added Innovative Translational Research (EYUVA)",
      "value": "Empowering Youth for Undertaking Value Added Innovative Translational Research (EYUVA)"
    },
    {
      "text": "Empowerment and Equity Oppurtunities for Excellence in Science {EMEQ}",
      "value": "Empowerment and Equity Oppurtunities for Excellence in Science {EMEQ}"
    },
    {
      "text": "ENHANCEMENT OF THE GRAM PANCHAYAT SPATIAL DEVELOPMENT PLANS (GPSDP)",
      "value": "ENHANCEMENT OF THE GRAM PANCHAYAT SPATIAL DEVELOPMENT PLANS (GPSDP)"
    },
    {
      "text": "Extra Mural Research {EMR}",
      "value": "Extra Mural Research {EMR}"
    },
    {
      "text": "FAST TRACK",
      "value": "FAST TRACK"
    },
    {
      "text": "Foldscope Scheme {}",
      "value": "Foldscope Scheme {}"
    },
    {
      "text": "Grant-in-aid {GIA}",
      "value": "Grant-in-aid {GIA}"
    },
    {
      "text": "Hydrogen and Fuel Cell Program",
      "value": "Hydrogen and Fuel Cell Program"
    },
    {
      "text": "ICMR Project",
      "value": "ICMR Project"
    },
    {
      "text": "IGSTC2+2 CALL 2025{}",
      "value": "IGSTC2+2 CALL 2025{}"
    },
    {
      "text": "IIT Project{}",
      "value": "IIT Project{}"
    },
    {
      "text": "Impactful Policy Research in Social Science {IMPRESS}",
      "value": "Impactful Policy Research in Social Science {IMPRESS}"
    },
    {
      "text": "inclusivity research grant",
      "value": "inclusivity research grant"
    },
    {
      "text": "Indian National Committee On Climate Change { INCCC }",
      "value": "Indian National Committee On Climate Change { INCCC }"
    },
    {
      "text": "Indo- Canada {}",
      "value": "Indo- Canada {}"
    },
    {
      "text": "Indo-German (DST-DAAD)",
      "value": "Indo-German (DST-DAAD)"
    },
    {
      "text": "Indo-South Africa Joint Project {Indo-South Africa Joint Project}",
      "value": "Indo-South Africa Joint Project {Indo-South Africa Joint Project}"
    },
    {
      "text": "INDO-SRI LANKA JOINT PROJECT {}",
      "value": "INDO-SRI LANKA JOINT PROJECT {}"
    },
    {
      "text": "INSPIRE Faculty Fellowship",
      "value": "INSPIRE Faculty Fellowship"
    },
    {
      "text": "INSPIRE Fellowship",
      "value": "INSPIRE Fellowship"
    },
    {
      "text": "Internation Travel Support (ITS)",
      "value": "Internation Travel Support (ITS)"
    },
    {
      "text": "ISEA-Phase II {ISEA}",
      "value": "ISEA-Phase II {ISEA}"
    },
    {
      "text": "Junior Research Project",
      "value": "Junior Research Project"
    },
    {
      "text": "Life Science Research Board",
      "value": "Life Science Research Board"
    },
    {
      "text": "MAHA",
      "value": "MAHA"
    },
    {
      "text": "Major Research Project",
      "value": "Major Research Project"
    },
    {
      "text": "Major Research Project {MRP}",
      "value": "Major Research Project {MRP}"
    },
    {
      "text": "Materials for Energy Storage {MES}",
      "value": "Materials for Energy Storage {MES}"
    },
    {
      "text": "Mathematical Research Impact-Centric Support Scheme {MATRICS}",
      "value": "Mathematical Research Impact-Centric Support Scheme {MATRICS}"
    },
    {
      "text": "Mechanical Engineering Department {}",
      "value": "Mechanical Engineering Department {}"
    },
    {
      "text": "MeitY Project",
      "value": "MeitY Project"
    },
    {
      "text": "MeraYuva Bharat",
      "value": "MeraYuva Bharat"
    },
    {
      "text": "MHRD",
      "value": "MHRD"
    },
    {
      "text": "Micro Drones{}",
      "value": "Micro Drones{}"
    },
    {
      "text": "Microsoft Academic Partnership Grant 2024",
      "value": "Microsoft Academic Partnership Grant 2024"
    },
    {
      "text": "Mineral exploration",
      "value": "Mineral exploration"
    },
    {
      "text": "MODROB Scheme {}",
      "value": "MODROB Scheme {}"
    },
    {
      "text": "Naan Mudhalvan Grand Innocvation & Skilling Challenge",
      "value": "Naan Mudhalvan Grand Innocvation & Skilling Challenge"
    },
    {
      "text": "National Agricultural Science Fund {NASF}",
      "value": "National Agricultural Science Fund {NASF}"
    },
    {
      "text": "National Green Hydrogen Mission {NGHM}",
      "value": "National Green Hydrogen Mission {NGHM}"
    },
    {
      "text": "National Level Exhibition",
      "value": "National Level Exhibition"
    },
    {
      "text": "National Post-Doctoral Fellowship{}",
      "value": "National Post-Doctoral Fellowship{}"
    },
    {
      "text": "Naval Physical & Oceanographic Laboratory (NPOL)",
      "value": "Naval Physical & Oceanographic Laboratory (NPOL)"
    },
    {
      "text": "NGP",
      "value": "NGP"
    },
    {
      "text": "NIL",
      "value": "NIL"
    },
    {
      "text": "Nil {}",
      "value": "Nil {}"
    },
    {
      "text": "Nil{}",
      "value": "Nil{}"
    },
    {
      "text": "NSTMIS {}",
      "value": "NSTMIS {}"
    },
    {
      "text": "Pandit Madan Mohan Malaviya National Mission of Teachers and Teaching Scheme {PMMMNMTTS}",
      "value": "Pandit Madan Mohan Malaviya National Mission of Teachers and Teaching Scheme {PMMMNMTTS}"
    },
    {
      "text": "Planning Development and Special Initiatives (TC-1) Department",
      "value": "Planning Development and Special Initiatives (TC-1) Department"
    },
    {
      "text": "Post-Doctoral Fellowship {}",
      "value": "Post-Doctoral Fellowship {}"
    },
    {
      "text": "PRAYAAS Scheme",
      "value": "PRAYAAS Scheme"
    },
    {
      "text": "Prime Minister Early Career Research Grant{}",
      "value": "Prime Minister Early Career Research Grant{}"
    },
    {
      "text": "Principal Scientific Advisor {PSA}",
      "value": "Principal Scientific Advisor {PSA}"
    },
    {
      "text": "Promoting Academic Research Conversion to Enterprise {PACE}",
      "value": "Promoting Academic Research Conversion to Enterprise {PACE}"
    },
    {
      "text": "R & D in IT/ Electronics/ CCBT scheme {}",
      "value": "R & D in IT/ Electronics/ CCBT scheme {}"
    },
    {
      "text": "Ramalingaswamy Re-entry Fellowship",
      "value": "Ramalingaswamy Re-entry Fellowship"
    },
    {
      "text": "Rashtriya Uchchatar Shiksha Abhiyan {RUSA}",
      "value": "Rashtriya Uchchatar Shiksha Abhiyan {RUSA}"
    },
    {
      "text": "REACHOUT-PAMC-OS",
      "value": "REACHOUT-PAMC-OS"
    },
    {
      "text": "Research & Development Programme in Water Sector and Implementation of National Water Mission",
      "value": "Research & Development Programme in Water Sector and Implementation of National Water Mission"
    },
    {
      "text": "Research & Development Scheme {R&D}",
      "value": "Research & Development Scheme {R&D}"
    },
    {
      "text": "Research & Development {R&D}",
      "value": "Research & Development {R&D}"
    },
    {
      "text": "Research and Development and Implementation of National Water Mission",
      "value": "Research and Development and Implementation of National Water Mission"
    },
    {
      "text": "Research Promotion Scheme {RPS}",
      "value": "Research Promotion Scheme {RPS}"
    },
    {
      "text": "RESPOND PROGRAMME{}",
      "value": "RESPOND PROGRAMME{}"
    },
    {
      "text": "Scheme for Transformational and Advanced Research in Sciences {STARS}",
      "value": "Scheme for Transformational and Advanced Research in Sciences {STARS}"
    },
    {
      "text": "Scheme for Young Scientists and Technologists {SYST}",
      "value": "Scheme for Young Scientists and Technologists {SYST}"
    },
    {
      "text": "Science & Engineering Research Board (SERB) Seminar/Symposia Scheme",
      "value": "Science & Engineering Research Board (SERB) Seminar/Symposia Scheme"
    },
    {
      "text": "Science and Engineering Research Board ( SERB)",
      "value": "Science and Engineering Research Board ( SERB)"
    },
    {
      "text": "Science and Heritage Research Initiative Scheme {SHRI}",
      "value": "Science and Heritage Research Initiative Scheme {SHRI}"
    },
    {
      "text": "Science and Technology for Women",
      "value": "Science and Technology for Women"
    },
    {
      "text": "SCIENCE AND TECHNOLOGY PROJECT SCHEME",
      "value": "SCIENCE AND TECHNOLOGY PROJECT SCHEME"
    },
    {
      "text": "Science and Technology Project {S&T Project}",
      "value": "Science and Technology Project {S&T Project}"
    },
    {
      "text": "Science and Technology Project {S&T}",
      "value": "Science and Technology Project {S&T}"
    },
    {
      "text": "Science for Equity, Empowerment & Development {SEED}",
      "value": "Science for Equity, Empowerment & Development {SEED}"
    },
    {
      "text": "Scientific Social Responsibility (SSR)",
      "value": "Scientific Social Responsibility (SSR)"
    },
    {
      "text": "SEED-TIDE {}",
      "value": "SEED-TIDE {}"
    },
    {
      "text": "SERB",
      "value": "SERB"
    },
    {
      "text": "SERB FAST TRACK SCHEME",
      "value": "SERB FAST TRACK SCHEME"
    },
    {
      "text": "SERB Project",
      "value": "SERB Project"
    },
    {
      "text": "SERB-POWER Grant Scheme {SPG}",
      "value": "SERB-POWER Grant Scheme {SPG}"
    },
    {
      "text": "SERB-SURE",
      "value": "SERB-SURE"
    },
    {
      "text": "SERB-TARE {}",
      "value": "SERB-TARE {}"
    },
    {
      "text": "SERC FAST TRACK SCHEME",
      "value": "SERC FAST TRACK SCHEME"
    },
    {
      "text": "Singara Chennai 2.0 Project {}",
      "value": "Singara Chennai 2.0 Project {}"
    },
    {
      "text": "Solid Waste Management",
      "value": "Solid Waste Management"
    },
    {
      "text": "Space Science Promotion",
      "value": "Space Science Promotion"
    },
    {
      "text": "Special call for Collaborative Research Projects on Vision Viksit Bharat@2047 {}",
      "value": "Special call for Collaborative Research Projects on Vision Viksit Bharat@2047 {}"
    },
    {
      "text": "Special Call for Proposals (erstwhilw SERB Scheme)",
      "value": "Special Call for Proposals (erstwhilw SERB Scheme)"
    },
    {
      "text": "State University Research Excellence (SERB SURE)",
      "value": "State University Research Excellence (SERB SURE)"
    },
    {
      "text": "Student Project Scheme {}",
      "value": "Student Project Scheme {}"
    },
    {
      "text": "Symposia",
      "value": "Symposia"
    },
    {
      "text": "Tamil Nadu Climate Change Mission {TNCCM}",
      "value": "Tamil Nadu Climate Change Mission {TNCCM}"
    },
    {
      "text": "Tamil Nadu Innovation Initiatives {TANII}",
      "value": "Tamil Nadu Innovation Initiatives {TANII}"
    },
    {
      "text": "TANUVAS {}",
      "value": "TANUVAS {}"
    },
    {
      "text": "Teachers Associateship for Research Excellence {TARE}",
      "value": "Teachers Associateship for Research Excellence {TARE}"
    },
    {
      "text": "Technology Development Programme {TDP}",
      "value": "Technology Development Programme {TDP}"
    },
    {
      "text": "Technology Mission Division {TMD}",
      "value": "Technology Mission Division {TMD}"
    },
    {
      "text": "TTDF",
      "value": "TTDF"
    },
    {
      "text": "UFUP {UFUP}",
      "value": "UFUP {UFUP}"
    },
    {
      "text": "UGC-BSR Research Start-Up-Grant {UGC-BSR}",
      "value": "UGC-BSR Research Start-Up-Grant {UGC-BSR}"
    },
    {
      "text": "UNICEF Project",
      "value": "UNICEF Project"
    },
    {
      "text": "University Grants Commission{UGC}",
      "value": "University Grants Commission{UGC}"
    },
    {
      "text": "Vigyan Dhara",
      "value": "Vigyan Dhara"
    },
    {
      "text": "WISE-KIRAN",
      "value": "WISE-KIRAN"
    },
    {
      "text": "Women Scientist Scheme A {WOS-A}",
      "value": "Women Scientist Scheme A {WOS-A}"
    },
    {
      "text": "Young Scientist-Human Resource Development {HRD}",
      "value": "Young Scientist-Human Resource Development {HRD}"
    }
  ];

const agencyType = [
    {
      "text": "Central",
      "value": "C"
    },
    {
      "text": "State",
      "value": "S"
    },
    {
      "text": "Private",
      "value": "P"
    },
    {
      "text": "Individual",
      "value": "I"
    }
  ];

const facultyNames = [
    {
      "text": ".",
      "value": "482"
    },
    {
      "text": ".",
      "value": "696"
    },
    {
      "text": ".",
      "value": "861"
    },
    {
      "text": ".",
      "value": "862"
    },
    {
      "text": ".",
      "value": "820"
    },
    {
      "text": ".",
      "value": "330"
    },
    {
      "text": ".",
      "value": "677"
    },
    {
      "text": ".",
      "value": "481"
    },
    {
      "text": ".",
      "value": "471"
    },
    {
      "text": "Arun Prakash. R.",
      "value": "1200"
    },
    {
      "text": "Indra Gandhi. K.",
      "value": "843"
    },
    {
      "text": "Indra Gandhi. K",
      "value": "1209"
    },
    {
      "text": "Kannan. R.",
      "value": "1157"
    },
    {
      "text": "Marshal Anthoni. S.",
      "value": "1120"
    },
    {
      "text": "Sreeja . B.S.",
      "value": "565"
    },
    {
      "text": "Aarthi . A.",
      "value": "1051"
    },
    {
      "text": "Abarna. P.",
      "value": "1038"
    },
    {
      "text": "ABHISHEK DHEEVEN. T.",
      "value": "948"
    },
    {
      "text": "Abirami. R.",
      "value": "825"
    },
    {
      "text": "Abirami Murugappan.",
      "value": "280"
    },
    {
      "text": "Abirami Murugappan.",
      "value": "255"
    },
    {
      "text": "Adaikkalam. V.",
      "value": "158"
    },
    {
      "text": "Adeline Arputha Olivia. P.",
      "value": "1048"
    },
    {
      "text": "Adhevin. Z.",
      "value": "564"
    },
    {
      "text": "Adhevin. Z.",
      "value": "559"
    },
    {
      "text": "Adhevin. Z.",
      "value": "558"
    },
    {
      "text": "Adhikesavan. C.",
      "value": "318"
    },
    {
      "text": "Agnes Mary. S",
      "value": "813"
    },
    {
      "text": "Aiswarya Devi. S.",
      "value": "833"
    },
    {
      "text": "Ajaykumar. L.",
      "value": "837"
    },
    {
      "text": "Akhila V Nath.",
      "value": "1192"
    },
    {
      "text": "Akhila V Nath.",
      "value": "1193"
    },
    {
      "text": "AKILA. C.",
      "value": "1090"
    },
    {
      "text": "AKILA. C",
      "value": "1267"
    },
    {
      "text": "AKILA. S.",
      "value": "842"
    },
    {
      "text": "AKILA. S.",
      "value": "841"
    },
    {
      "text": "Akilandeeswari. A",
      "value": "1084"
    },
    {
      "text": "Akilandeeswari. A",
      "value": "1083"
    },
    {
      "text": "Alagar. M.",
      "value": "821"
    },
    {
      "text": "Alagiri. G.",
      "value": "1235"
    },
    {
      "text": "Alagirigovindasamy.",
      "value": "1276"
    },
    {
      "text": "Alagunambi Ramasubbu.",
      "value": "1293"
    },
    {
      "text": "Amalraj. S.",
      "value": "76"
    },
    {
      "text": "Amudha. T.",
      "value": "23"
    },
    {
      "text": "Anand Kumar.",
      "value": "378"
    },
    {
      "text": "Ananda Kumar. S.",
      "value": "265"
    },
    {
      "text": "Anandaraj. B.",
      "value": "766"
    },
    {
      "text": "Anandkumar. G.",
      "value": "1007"
    },
    {
      "text": "Ananthu Vijayan V L.",
      "value": "1219"
    },
    {
      "text": "Ananthu Vijayan V L.",
      "value": "1218"
    },
    {
      "text": "ANBALAGAN. P.",
      "value": "1004"
    },
    {
      "text": "Anbalagan . P.",
      "value": "531"
    },
    {
      "text": "Anbarasi. K.",
      "value": "539"
    },
    {
      "text": "Anbuchelian. S.",
      "value": "373"
    },
    {
      "text": "ANBUSELVI . S. V.",
      "value": "868"
    },
    {
      "text": "Angayarkanny. S.",
      "value": "161"
    },
    {
      "text": "Angelin Gladston.",
      "value": "400"
    },
    {
      "text": "Anitha. P",
      "value": "1278"
    },
    {
      "text": "ANITHA. G",
      "value": "973"
    },
    {
      "text": "Anitha. G.",
      "value": "397"
    },
    {
      "text": "Anitha Rajathi. V. M.",
      "value": "442"
    },
    {
      "text": "ANITHA RAJATHI. V.M",
      "value": "664"
    },
    {
      "text": "Anju A Chandran.",
      "value": "1074"
    },
    {
      "text": "Annamalai. K.",
      "value": "209"
    },
    {
      "text": "Annamalai. K.",
      "value": "216"
    },
    {
      "text": "Annamalai Kandasamy.",
      "value": "343"
    },
    {
      "text": "ANNENEWMY. B.",
      "value": "1043"
    },
    {
      "text": "ANNENEWMY. B",
      "value": "1044"
    },
    {
      "text": "ANTONY AJIN. V. C.",
      "value": "966"
    },
    {
      "text": "Antony Heartlin Sancta. A.",
      "value": "1000"
    },
    {
      "text": "Anuradha. C. D.",
      "value": "521"
    },
    {
      "text": "AQUILINE LYDIA. L.",
      "value": "1088"
    },
    {
      "text": "Aravindhan. V.",
      "value": "804"
    },
    {
      "text": "Archana. T.",
      "value": "157"
    },
    {
      "text": "Arivanandhan. M.",
      "value": "44"
    },
    {
      "text": "Arivanandhan. M",
      "value": "771"
    },
    {
      "text": "Arivazhaki. D.",
      "value": "1079"
    },
    {
      "text": "Arivudainambi. D.",
      "value": "958"
    },
    {
      "text": "Arivudainambi. D.",
      "value": "846"
    },
    {
      "text": "Arivuoli. D.",
      "value": "451"
    },
    {
      "text": "Arjun. P.",
      "value": "673"
    },
    {
      "text": "Arockia Xavier Annie. R.",
      "value": "338"
    },
    {
      "text": "Arshad Ahmed. K.",
      "value": "1259"
    },
    {
      "text": "Arul Aram. I.",
      "value": "762"
    },
    {
      "text": "Arul Aram. I.",
      "value": "537"
    },
    {
      "text": "Arul Deepa. K.",
      "value": "944"
    },
    {
      "text": "Arul Franco. P",
      "value": "1273"
    },
    {
      "text": "Arulchelvan. S.",
      "value": "8"
    },
    {
      "text": "Arulmathi. P.",
      "value": "348"
    },
    {
      "text": "Arulmozhi. R.",
      "value": "597"
    },
    {
      "text": "Arulmozhi. M.",
      "value": "317"
    },
    {
      "text": "Arumugam. V.",
      "value": "755"
    },
    {
      "text": "Arumugam. V.",
      "value": "54"
    },
    {
      "text": "ARUN. V",
      "value": "1236"
    },
    {
      "text": "Arun. V.",
      "value": "1223"
    },
    {
      "text": "ARUN. V",
      "value": "1237"
    },
    {
      "text": "Arun Babu. E.",
      "value": "410"
    },
    {
      "text": "Arun Kumar. M",
      "value": "1049"
    },
    {
      "text": "Arun Kumar. M.",
      "value": "1050"
    },
    {
      "text": "Arun Prakash. C.",
      "value": "770"
    },
    {
      "text": "Arun Prakash. S.",
      "value": "303"
    },
    {
      "text": "Arunachalam. K",
      "value": "725"
    },
    {
      "text": "Arunachalam. K.",
      "value": "385"
    },
    {
      "text": "Arunkumar. T",
      "value": "744"
    },
    {
      "text": "Arunmetha Sundaramoorthy.",
      "value": "37"
    },
    {
      "text": "Ashok Kumar. S.",
      "value": "60"
    },
    {
      "text": "ATHIMOOLAM. S.",
      "value": "1091"
    },
    {
      "text": "Augustin. A",
      "value": "844"
    },
    {
      "text": "BABU. D.",
      "value": "620"
    },
    {
      "text": "Balachander. P.",
      "value": "229"
    },
    {
      "text": "BALAJI . C.",
      "value": "1181"
    },
    {
      "text": "Balaji. J.",
      "value": "616"
    },
    {
      "text": "Balaji. R.",
      "value": "478"
    },
    {
      "text": "Balaji. R.",
      "value": "466"
    },
    {
      "text": "Balamadeswaran. P",
      "value": "470"
    },
    {
      "text": "Balamadeswaran. P.",
      "value": "850"
    },
    {
      "text": "Balamurugan. C",
      "value": "497"
    },
    {
      "text": "Balamurugan. C.",
      "value": "462"
    },
    {
      "text": "Balamurugan. C.",
      "value": "648"
    },
    {
      "text": "Balamurugan. G.",
      "value": "305"
    },
    {
      "text": "Balamurugan. R.",
      "value": "413"
    },
    {
      "text": "Balasingh Moses. M.",
      "value": "529"
    },
    {
      "text": "BALASINGH MOSES. M",
      "value": "963"
    },
    {
      "text": "BALASINGH MOSES. M",
      "value": "1202"
    },
    {
      "text": "Balasivanandha Prabu. S",
      "value": "518"
    },
    {
      "text": "Balasivanandha Prabu. S",
      "value": "519"
    },
    {
      "text": "Balasivanandha Prabu. S.",
      "value": "246"
    },
    {
      "text": "Balasubramaniajn. N",
      "value": "1069"
    },
    {
      "text": "Balasubramaniajn. N",
      "value": "1068"
    },
    {
      "text": "Balasubramanian. N.",
      "value": "560"
    },
    {
      "text": "Balasubramanian. N.",
      "value": "3"
    },
    {
      "text": "Balasubramanian. N",
      "value": "854"
    },
    {
      "text": "Balasubramanian. N",
      "value": "855"
    },
    {
      "text": "Balasubramanian . Natesa",
      "value": "728"
    },
    {
      "text": "Balasubramanian N. N",
      "value": "1108"
    },
    {
      "text": "Balasubramanian Natesan. Natesa",
      "value": "729"
    },
    {
      "text": "Bama. S",
      "value": "603"
    },
    {
      "text": "Bama. S.",
      "value": "439"
    },
    {
      "text": "Banumathi. J.",
      "value": "1255"
    },
    {
      "text": "Baskar . K.",
      "value": "427"
    },
    {
      "text": "Baskaralingam. P.",
      "value": "70"
    },
    {
      "text": "BASKARALINGAM. P.",
      "value": "739"
    },
    {
      "text": "Baskaran. R.",
      "value": "388"
    },
    {
      "text": "Begam Elavarasi. S.",
      "value": "64"
    },
    {
      "text": "Bhagavathiammal. G. J.",
      "value": "116"
    },
    {
      "text": "Bhagyaveni. M A",
      "value": "254"
    },
    {
      "text": "Bhagyaveni. M. A.",
      "value": "238"
    },
    {
      "text": "BHARANIDHARAN. G.",
      "value": "954"
    },
    {
      "text": "Bharanidharan. G",
      "value": "271"
    },
    {
      "text": "Bharanidharan. G",
      "value": "270"
    },
    {
      "text": "Bharanidharan. G.",
      "value": "269"
    },
    {
      "text": "Bhargavi Gunturu.",
      "value": "128"
    },
    {
      "text": "Bhargavi Gunturu.",
      "value": "455"
    },
    {
      "text": "Bhaskar. G. B.",
      "value": "325"
    },
    {
      "text": "BHUVANESHWARI. S.",
      "value": "872"
    },
    {
      "text": "Bhuvaneswari. P.T.V.",
      "value": "304"
    },
    {
      "text": "Bindu. M.V",
      "value": "741"
    },
    {
      "text": "Bose. S.",
      "value": "310"
    },
    {
      "text": "Brahadeeswaran. S.",
      "value": "125"
    },
    {
      "text": "Brahadeeswaran. S",
      "value": "1257"
    },
    {
      "text": "Brahadeeswaran. S.",
      "value": "685"
    },
    {
      "text": "Brinda Lakshmi. A.",
      "value": "236"
    },
    {
      "text": "Brindha. R.",
      "value": "384"
    },
    {
      "text": "BRINDHA. R.",
      "value": "657"
    },
    {
      "text": "Brindha. R",
      "value": "659"
    },
    {
      "text": "Brindha. R",
      "value": "658"
    },
    {
      "text": "Bruce Ralphin Rose. J.",
      "value": "1076"
    },
    {
      "text": "Bruce Ralphin Rose. J",
      "value": "735"
    },
    {
      "text": "Carolin Arul.",
      "value": "827"
    },
    {
      "text": "Chandrasekar. P.",
      "value": "320"
    },
    {
      "text": "Chandrasekar. P.",
      "value": "465"
    },
    {
      "text": "Chandru. S",
      "value": "1297"
    },
    {
      "text": "Charis Ruth . S.",
      "value": "1057"
    },
    {
      "text": "Chithra. K.",
      "value": "487"
    },
    {
      "text": "Chithra. S.",
      "value": "719"
    },
    {
      "text": "CHITHRA. S",
      "value": "634"
    },
    {
      "text": "Chithra. K.",
      "value": "6"
    },
    {
      "text": "Chithra. K",
      "value": "1300"
    },
    {
      "text": "Chitra Margaret Dey.",
      "value": "593"
    },
    {
      "text": "Chitra Selvi. S.",
      "value": "768"
    },
    {
      "text": "Chitra Selvi. S.",
      "value": "767"
    },
    {
      "text": "Chitrakala. S.",
      "value": "16"
    },
    {
      "text": "Cokilavany. D.",
      "value": "989"
    },
    {
      "text": "Colins Johnny. J.",
      "value": "111"
    },
    {
      "text": "Deepan Bharathi Kannan . T.",
      "value": "552"
    },
    {
      "text": "Deivamani . M.",
      "value": "802"
    },
    {
      "text": "Dejey.",
      "value": "283"
    },
    {
      "text": "DEJEY.",
      "value": "612"
    },
    {
      "text": "Dejey.",
      "value": "571"
    },
    {
      "text": "Devasena. T.",
      "value": "179"
    },
    {
      "text": "Devi. R.S",
      "value": "1145"
    },
    {
      "text": "Dhalia Sweetlin. J.",
      "value": "367"
    },
    {
      "text": "Dhalia Sweetlin. J",
      "value": "1249"
    },
    {
      "text": "Dhananjay Kumar.",
      "value": "368"
    },
    {
      "text": "Dharmendira Kumar. M.",
      "value": "7"
    },
    {
      "text": "Dharsini. N.",
      "value": "903"
    },
    {
      "text": "Dharsini. N.",
      "value": "902"
    },
    {
      "text": "Dhiksha. K.",
      "value": "858"
    },
    {
      "text": "Dhinagaran. G.",
      "value": "1005"
    },
    {
      "text": "Dhivakar G.",
      "value": "1080"
    },
    {
      "text": "DHIVYA. S.",
      "value": "89"
    },
    {
      "text": "Dhurga Devi.",
      "value": "758"
    },
    {
      "text": "Dhurga Devi. J.",
      "value": "136"
    },
    {
      "text": "Dillibabu. R",
      "value": "938"
    },
    {
      "text": "Dillibabu. R.",
      "value": "940"
    },
    {
      "text": "Dinakaran. K.",
      "value": "671"
    },
    {
      "text": "DINESH. D.",
      "value": "988"
    },
    {
      "text": "Dinesh Kumar. J.",
      "value": "1229"
    },
    {
      "text": "DIVA . T.",
      "value": "1252"
    },
    {
      "text": "DIVYA. A.",
      "value": "886"
    },
    {
      "text": "DIVYA. P.",
      "value": "1110"
    },
    {
      "text": "DIVYA. T.",
      "value": "1253"
    },
    {
      "text": "DIVYA PRIYA . B.",
      "value": "864"
    },
    {
      "text": "Dr. Esther Florence S. S.",
      "value": "883"
    },
    {
      "text": "Dr. Suresh Kannan. I.",
      "value": "1093"
    },
    {
      "text": "Durairasan. M",
      "value": "1107"
    },
    {
      "text": "Durgalakshmi. D.",
      "value": "682"
    },
    {
      "text": "Edwin. M.",
      "value": "1196"
    },
    {
      "text": "Elango. M.",
      "value": "281"
    },
    {
      "text": "Elango. L.",
      "value": "91"
    },
    {
      "text": "Elangovan. K.",
      "value": "870"
    },
    {
      "text": "Elangovan. G.",
      "value": "299"
    },
    {
      "text": "Elaya Perumal. A.",
      "value": "249"
    },
    {
      "text": "Elayaperumal. A",
      "value": "217"
    },
    {
      "text": "Esther Florence. S.",
      "value": "884"
    },
    {
      "text": "Esther Florence S. S.",
      "value": "591"
    },
    {
      "text": "Evany Nithya. S.",
      "value": "530"
    },
    {
      "text": "EVELYN SYNTHIYA.",
      "value": "951"
    },
    {
      "text": "EWINS PON PUSHPA. S.",
      "value": "686"
    },
    {
      "text": "Ewins Pon Pushpa. S.",
      "value": "245"
    },
    {
      "text": "EWINS PON PUSHPA. S",
      "value": "687"
    },
    {
      "text": "Ezhilarasan. M.",
      "value": "1232"
    },
    {
      "text": "Ezhilmaran. V.",
      "value": "683"
    },
    {
      "text": "Gajalakshmi. M.",
      "value": "950"
    },
    {
      "text": "Gajalakshmi. P.",
      "value": "181"
    },
    {
      "text": "Gajalakshmi. D.",
      "value": "375"
    },
    {
      "text": "Ganapathi Malarvizhi.",
      "value": "287"
    },
    {
      "text": "GANDHI RAJ. R.",
      "value": "978"
    },
    {
      "text": "Ganesh. P.",
      "value": "293"
    },
    {
      "text": "Ganesh. D.",
      "value": "138"
    },
    {
      "text": "Ganesh Kumar. P.",
      "value": "796"
    },
    {
      "text": "GANESH KUMAR. S",
      "value": "1102"
    },
    {
      "text": "Ganesh Kumar. S.",
      "value": "94"
    },
    {
      "text": "Ganesh Madhan. M.",
      "value": "284"
    },
    {
      "text": "Ganesh Ram. A.",
      "value": "1026"
    },
    {
      "text": "Ganesh Ram. A.",
      "value": "360"
    },
    {
      "text": "Gautam. P.",
      "value": "100"
    },
    {
      "text": "Gayathri . K.",
      "value": "1105"
    },
    {
      "text": "Gayathri. S.",
      "value": "1071"
    },
    {
      "text": "Gayathri K. K.",
      "value": "1104"
    },
    {
      "text": "Geetha. D.",
      "value": "879"
    },
    {
      "text": "Geetha. D.",
      "value": "319"
    },
    {
      "text": "Geetha. S.",
      "value": "433"
    },
    {
      "text": "Geetha. P.",
      "value": "789"
    },
    {
      "text": "Geetha. T. V",
      "value": "679"
    },
    {
      "text": "Geetha. G.",
      "value": "718"
    },
    {
      "text": "Geetha . D",
      "value": "877"
    },
    {
      "text": "Geetha D.",
      "value": "876"
    },
    {
      "text": "Geetha Ramani. R.",
      "value": "222"
    },
    {
      "text": "Geethalakshmi. R",
      "value": "199"
    },
    {
      "text": "Giridev. V.R.",
      "value": "29"
    },
    {
      "text": "Gnanavel Babu. A.",
      "value": "130"
    },
    {
      "text": "GOBI. N.",
      "value": "650"
    },
    {
      "text": "Gobi. N.",
      "value": "379"
    },
    {
      "text": "Golden Julie . E.",
      "value": "1261"
    },
    {
      "text": "Gomathi. V",
      "value": "1046"
    },
    {
      "text": "Gomathi. V",
      "value": "1040"
    },
    {
      "text": "Gomathi. R.",
      "value": "241"
    },
    {
      "text": "Gomathi. V.",
      "value": "1035"
    },
    {
      "text": "Gomathi. C.",
      "value": "598"
    },
    {
      "text": "Gomathi Chandran.",
      "value": "847"
    },
    {
      "text": "Gomathi Priya. P.",
      "value": "491"
    },
    {
      "text": "Gomathi Priya. P.",
      "value": "214"
    },
    {
      "text": "Gopalakrishnan. R.",
      "value": "1159"
    },
    {
      "text": "Gopinath. R.",
      "value": "836"
    },
    {
      "text": "Govindh. G",
      "value": "1283"
    },
    {
      "text": "Gowa. G",
      "value": "1284"
    },
    {
      "text": "Gowrisree. V.",
      "value": "58"
    },
    {
      "text": "Gowtham. SI",
      "value": "1134"
    },
    {
      "text": "Gowtham. SI.",
      "value": "1133"
    },
    {
      "text": "Greeshma. S.",
      "value": "436"
    },
    {
      "text": "Gulam Nabi Alsath. M.",
      "value": "714"
    },
    {
      "text": "Gunaseelan. K.",
      "value": "356"
    },
    {
      "text": "Gunasekaran. K.",
      "value": "67"
    },
    {
      "text": "Gunasekaran. R.",
      "value": "268"
    },
    {
      "text": "Gunasekaran. K.",
      "value": "447"
    },
    {
      "text": "Gunasekaran. M.",
      "value": "1116"
    },
    {
      "text": "Gunasekaran. M.",
      "value": "1020"
    },
    {
      "text": "Gunasundari. C.",
      "value": "1082"
    },
    {
      "text": "Gunasundari. C.",
      "value": "1081"
    },
    {
      "text": "GURUSIVAM. P",
      "value": "976"
    },
    {
      "text": "Hansa Lysander Manohar.",
      "value": "225"
    },
    {
      "text": "Hariharan. P.",
      "value": "371"
    },
    {
      "text": "Harini Loganathan.",
      "value": "1222"
    },
    {
      "text": "HARITHALAKSHMI. R.",
      "value": "920"
    },
    {
      "text": "Head of the Department.",
      "value": "460"
    },
    {
      "text": "Helen Kalavathy. M.",
      "value": "148"
    },
    {
      "text": "Hema . M.",
      "value": "792"
    },
    {
      "text": "HEMA. J.",
      "value": "1027"
    },
    {
      "text": "Hema Achyuthan.",
      "value": "347"
    },
    {
      "text": "Hemaiswarya Shanmugam. S.",
      "value": "173"
    },
    {
      "text": "Hemalatha. P.",
      "value": "163"
    },
    {
      "text": "Hemalatha. M.",
      "value": "421"
    },
    {
      "text": "Hemalatha . M.",
      "value": "793"
    },
    {
      "text": "Hemamalini. V.",
      "value": "147"
    },
    {
      "text": "HEMAMALINI. J.",
      "value": "536"
    },
    {
      "text": "Hemananthan. E.",
      "value": "456"
    },
    {
      "text": "HEMANATHAN. E.",
      "value": "14"
    },
    {
      "text": "Hosimin Thilagar. S.",
      "value": "463"
    },
    {
      "text": "Hosimin Thilagar. S.",
      "value": "92"
    },
    {
      "text": "Ilakkiya. S",
      "value": "943"
    },
    {
      "text": "Indhumathi. B",
      "value": "1127"
    },
    {
      "text": "Indra Gandhi. K.",
      "value": "300"
    },
    {
      "text": "Indumathi. B",
      "value": "1006"
    },
    {
      "text": "Indumathi. J.",
      "value": "174"
    },
    {
      "text": "Iniyan. S.",
      "value": "52"
    },
    {
      "text": "Jancirani. J",
      "value": "893"
    },
    {
      "text": "Jancirani. J.",
      "value": "892"
    },
    {
      "text": "Jancirani. J.",
      "value": "894"
    },
    {
      "text": "Jane Helena. H.",
      "value": "311"
    },
    {
      "text": "JASON THAMIZHAKARAN. S.",
      "value": "923"
    },
    {
      "text": "Jaya. K.P.",
      "value": "308"
    },
    {
      "text": "Jaya. N.",
      "value": "540"
    },
    {
      "text": "Jaya. N.",
      "value": "1206"
    },
    {
      "text": "Jayabalan. J.",
      "value": "1034"
    },
    {
      "text": "JAYACHITRA. V.P",
      "value": "631"
    },
    {
      "text": "Jayachitra. V P",
      "value": "838"
    },
    {
      "text": "JAYAKUMARI. L. S.",
      "value": "662"
    },
    {
      "text": "Jayakumari. L.S.",
      "value": "404"
    },
    {
      "text": "Jayalakshmi. S.",
      "value": "638"
    },
    {
      "text": "Jayalakshmi. S.",
      "value": "197"
    },
    {
      "text": "Jayalakshmi. S",
      "value": "224"
    },
    {
      "text": "Jayamala.",
      "value": "541"
    },
    {
      "text": "Jayamuthunagai. J.",
      "value": "102"
    },
    {
      "text": "Jayanthi. S.",
      "value": "494"
    },
    {
      "text": "Jayapriya. J.",
      "value": "757"
    },
    {
      "text": "Jayapriya. J.",
      "value": "795"
    },
    {
      "text": "Jayapriya. J.",
      "value": "90"
    },
    {
      "text": "Jayapriya. J.",
      "value": "805"
    },
    {
      "text": "Jayasakthi. S.",
      "value": "922"
    },
    {
      "text": "Jayashree. P.",
      "value": "502"
    },
    {
      "text": "Jayashree Padmanabhan.",
      "value": "243"
    },
    {
      "text": "Jayasree. T.",
      "value": "259"
    },
    {
      "text": "Jayasree. T.",
      "value": "568"
    },
    {
      "text": "Jayavel. R.",
      "value": "22"
    },
    {
      "text": "Jayavel. R",
      "value": "748"
    },
    {
      "text": "Jebaraj. C.",
      "value": "816"
    },
    {
      "text": "JEEVAMALAR. J",
      "value": "987"
    },
    {
      "text": "JEGATHA DEBORAH . L.",
      "value": "860"
    },
    {
      "text": "JEGATHA DEBORAH. L.",
      "value": "632"
    },
    {
      "text": "Jegatha Deborah. L.",
      "value": "326"
    },
    {
      "text": "JENSLIN DIVONA. W.",
      "value": "984"
    },
    {
      "text": "JESTIN LENUS. A.",
      "value": "969"
    },
    {
      "text": "Jesu Vedha Nayahi . J.",
      "value": "1260"
    },
    {
      "text": "JEYALAKSHMI. V.",
      "value": "692"
    },
    {
      "text": "JEYAPRABHA . C.",
      "value": "1271"
    },
    {
      "text": "JHANSI RANI NATHAN.",
      "value": "21"
    },
    {
      "text": "Jijo James.",
      "value": "889"
    },
    {
      "text": "Jijo James.",
      "value": "888"
    },
    {
      "text": "John Prakash. A",
      "value": "506"
    },
    {
      "text": "John Vennison. S.",
      "value": "760"
    },
    {
      "text": "JOHNSI. M.",
      "value": "1067"
    },
    {
      "text": "Jones Tarcius Doss. L.",
      "value": "756"
    },
    {
      "text": "Josephine Pon Gloria. J.",
      "value": "1176"
    },
    {
      "text": "Jothi Venkatachalam. K.",
      "value": "87"
    },
    {
      "text": "JOTHIVEL . S.",
      "value": "983"
    },
    {
      "text": "JOTHIVENKATACHALAM. K",
      "value": "856"
    },
    {
      "text": "JOTHIVENKATACHALAM. K.",
      "value": "857"
    },
    {
      "text": "Joy Vasantha Rani. S.P.",
      "value": "408"
    },
    {
      "text": "Joy Vasantha Rani . S. P.",
      "value": "931"
    },
    {
      "text": "Justin Dhanaraj. C.",
      "value": "104"
    },
    {
      "text": "K SivaKumar.",
      "value": "592"
    },
    {
      "text": "Kaaviya. R",
      "value": "1055"
    },
    {
      "text": "Kaaviya. R.",
      "value": "852"
    },
    {
      "text": "Kabilan. R.",
      "value": "1002"
    },
    {
      "text": "KALAICHELVAN. K",
      "value": "717"
    },
    {
      "text": "KALAICHELVAN. K.",
      "value": "716"
    },
    {
      "text": "Kalaichelvan. K.",
      "value": "123"
    },
    {
      "text": "KALAIMAGAL. S.",
      "value": "619"
    },
    {
      "text": "Kalaiselvam. S.",
      "value": "133"
    },
    {
      "text": "Kaliraj. P.",
      "value": "815"
    },
    {
      "text": "KALPANA. D.",
      "value": "1125"
    },
    {
      "text": "Kalpana. G.",
      "value": "432"
    },
    {
      "text": "Kalpana. D.",
      "value": "415"
    },
    {
      "text": "Kalpana. G.",
      "value": "112"
    },
    {
      "text": "Kamala. V.",
      "value": "1187"
    },
    {
      "text": "Kamala. J.",
      "value": "56"
    },
    {
      "text": "Kamala. V",
      "value": "1186"
    },
    {
      "text": "Kamala. V.",
      "value": "939"
    },
    {
      "text": "Kamala. J.",
      "value": "1096"
    },
    {
      "text": "Kamala. V",
      "value": "1185"
    },
    {
      "text": "Kamalanand. K.",
      "value": "706"
    },
    {
      "text": "Kamalanand . A.",
      "value": "401"
    },
    {
      "text": "Kanchana. M.",
      "value": "607"
    },
    {
      "text": "Kanchana Manivasakan.",
      "value": "154"
    },
    {
      "text": "Kanimozhi. K.",
      "value": "336"
    },
    {
      "text": "Kanimozhi . R",
      "value": "1214"
    },
    {
      "text": "Kanimozhi. R.",
      "value": "454"
    },
    {
      "text": "Kanmani. S.",
      "value": "75"
    },
    {
      "text": "Kanmani Shanmuga Priya. R.",
      "value": "676"
    },
    {
      "text": "Kanmani Shanmuga Priya. R.",
      "value": "261"
    },
    {
      "text": "Kannan. P.",
      "value": "189"
    },
    {
      "text": "Kannan. P.",
      "value": "1169"
    },
    {
      "text": "Kanthababu. M.",
      "value": "1150"
    },
    {
      "text": "Kanthavel. K.",
      "value": "1152"
    },
    {
      "text": "Karthick . S.",
      "value": "1239"
    },
    {
      "text": "Karthick. S",
      "value": "1275"
    },
    {
      "text": "KARTHIGA. K.",
      "value": "1073"
    },
    {
      "text": "karthigeyan. D.",
      "value": "853"
    },
    {
      "text": "KARTHIGEYAN. D.",
      "value": "732"
    },
    {
      "text": "Karthika. S",
      "value": "1147"
    },
    {
      "text": "Karthika. S.",
      "value": "937"
    },
    {
      "text": "Karthika. S.",
      "value": "1146"
    },
    {
      "text": "Karthika. R.",
      "value": "863"
    },
    {
      "text": "Karthika Devi. M. S.",
      "value": "339"
    },
    {
      "text": "Karthika Devi. M. S.",
      "value": "509"
    },
    {
      "text": "Karthika Devi . M.S",
      "value": "1016"
    },
    {
      "text": "Karthikeyan. P.",
      "value": "380"
    },
    {
      "text": "KARTHIKEYAN. M.S.",
      "value": "1030"
    },
    {
      "text": "Karthikeyan. S.",
      "value": "212"
    },
    {
      "text": "KARTHIKEYAN. M S",
      "value": "1251"
    },
    {
      "text": "KARTHIKEYAN. M.S.",
      "value": "1031"
    },
    {
      "text": "Karthikeyan. G.",
      "value": "1290"
    },
    {
      "text": "Karthikeyan . P.",
      "value": "797"
    },
    {
      "text": "KATHIROLI. R.",
      "value": "655"
    },
    {
      "text": "Kathiroli. R.",
      "value": "503"
    },
    {
      "text": "Kavitha. S.",
      "value": "126"
    },
    {
      "text": "Kavitha. A.",
      "value": "409"
    },
    {
      "text": "Kavitha. R.",
      "value": "495"
    },
    {
      "text": "Kavitha. G.",
      "value": "131"
    },
    {
      "text": "Kavitha. G.",
      "value": "1180"
    },
    {
      "text": "Kavitha. N.P.",
      "value": "187"
    },
    {
      "text": "Kavitha. R.",
      "value": "578"
    },
    {
      "text": "Kavitha Sankaranarayanan.",
      "value": "324"
    },
    {
      "text": "Kavitha Shanmugam.",
      "value": "594"
    },
    {
      "text": "Kaviyarasu . A.",
      "value": "874"
    },
    {
      "text": "Kaviyarasu. A.",
      "value": "309"
    },
    {
      "text": "Kayalvizhi. J",
      "value": "759"
    },
    {
      "text": "Keerthana Rani. M.S.",
      "value": "302"
    },
    {
      "text": "KEERTHI.",
      "value": "149"
    },
    {
      "text": "Keerthi.",
      "value": "328"
    },
    {
      "text": "Keerthi.",
      "value": "5"
    },
    {
      "text": "KEERTHI. P.",
      "value": "1175"
    },
    {
      "text": "KEERTHI. P.",
      "value": "1174"
    },
    {
      "text": "KEERTHI. P",
      "value": "1172"
    },
    {
      "text": "Khanna Nehemiah. H.",
      "value": "840"
    },
    {
      "text": "Kiranmayi.",
      "value": "730"
    },
    {
      "text": "Kiranmayi.",
      "value": "731"
    },
    {
      "text": "Kirthica. S.",
      "value": "570"
    },
    {
      "text": "Kirubaveni. S.",
      "value": "713"
    },
    {
      "text": "Kola Sujatha. P.",
      "value": "366"
    },
    {
      "text": "Komathi Murugan.",
      "value": "806"
    },
    {
      "text": "Kothandaraman. B",
      "value": "556"
    },
    {
      "text": "Kotilingam. K.",
      "value": "1201"
    },
    {
      "text": "KOTTILINGAM. K.",
      "value": "651"
    },
    {
      "text": "Krishna Kumar. R.",
      "value": "38"
    },
    {
      "text": "Krishnakumar. M.",
      "value": "419"
    },
    {
      "text": "Krishnakumar Subbiah.",
      "value": "77"
    },
    {
      "text": "Krishnaveni. M",
      "value": "851"
    },
    {
      "text": "Krishnaveni. M.",
      "value": "289"
    },
    {
      "text": "Kumar. B.",
      "value": "152"
    },
    {
      "text": "Kumar. J.",
      "value": "25"
    },
    {
      "text": "Kumar Balaraman.",
      "value": "745"
    },
    {
      "text": "Kumaravel.",
      "value": "811"
    },
    {
      "text": "Kumaresan. V.",
      "value": "96"
    },
    {
      "text": "Kumaresan. M",
      "value": "1263"
    },
    {
      "text": "Kumaresan. G.",
      "value": "344"
    },
    {
      "text": "Kumaresan. G.",
      "value": "866"
    },
    {
      "text": "Kumaresan. G",
      "value": "1018"
    },
    {
      "text": "Kumaresan. G.",
      "value": "162"
    },
    {
      "text": "Kumudini Devi. R.P.",
      "value": "1037"
    },
    {
      "text": "Kurian Joseph.",
      "value": "266"
    },
    {
      "text": "Lakshmana Prabhu. S.",
      "value": "82"
    },
    {
      "text": "Lakshmi. B.S.",
      "value": "15"
    },
    {
      "text": "Lakshmi. P.",
      "value": "292"
    },
    {
      "text": "LAKSHMI NARASIMHAN. C",
      "value": "898"
    },
    {
      "text": "Lakshmi Narasimhan. C.",
      "value": "159"
    },
    {
      "text": "Lakshmipriya. S",
      "value": "1056"
    },
    {
      "text": "Latha. K.",
      "value": "389"
    },
    {
      "text": "Latha. S.",
      "value": "500"
    },
    {
      "text": "Latha. K.",
      "value": "57"
    },
    {
      "text": "Latha. S.",
      "value": "72"
    },
    {
      "text": "Latha Nagendran.",
      "value": "803"
    },
    {
      "text": "Lavanya. R.",
      "value": "538"
    },
    {
      "text": "Lavanya. S.K.",
      "value": "880"
    },
    {
      "text": "LAVANYA. R.",
      "value": "665"
    },
    {
      "text": "Laxmikandan. T.",
      "value": "772"
    },
    {
      "text": "Laxmikandan. T.",
      "value": "359"
    },
    {
      "text": "Leelamani. A.",
      "value": "1121"
    },
    {
      "text": "Lekha. R.",
      "value": "974"
    },
    {
      "text": "Lekshmi. G. S.",
      "value": "202"
    },
    {
      "text": "Lenin Kalyana Sundaram. V.",
      "value": "752"
    },
    {
      "text": "Lenin Kalyanasundaram. V.",
      "value": "933"
    },
    {
      "text": "Lenty Stuwart. S.",
      "value": "84"
    },
    {
      "text": "Lima Rose Miranda. M.",
      "value": "355"
    },
    {
      "text": "Lingadurai. K.",
      "value": "59"
    },
    {
      "text": "LOGANATHAN. P.",
      "value": "733"
    },
    {
      "text": "Lokesh. S.",
      "value": "301"
    },
    {
      "text": "Lourdes Joavani. J.",
      "value": "1072"
    },
    {
      "text": "Lydia Elizabeth . B.",
      "value": "504"
    },
    {
      "text": "Lydia Elizabeth . B.",
      "value": "505"
    },
    {
      "text": "Lynn Salome Daniel.",
      "value": "949"
    },
    {
      "text": "Lysa Packiam. R. S.",
      "value": "1227"
    },
    {
      "text": "Madhavi Ganesan.",
      "value": "232"
    },
    {
      "text": "Madhesh. P",
      "value": "1103"
    },
    {
      "text": "Madhumita Maragathavelan.",
      "value": "970"
    },
    {
      "text": "Madhupriya. P.",
      "value": "1141"
    },
    {
      "text": "Magesh. R.",
      "value": "276"
    },
    {
      "text": "Magesh. R.",
      "value": "247"
    },
    {
      "text": "Mahadevi. P.",
      "value": "1191"
    },
    {
      "text": "Mahalakshmi. G. S.",
      "value": "995"
    },
    {
      "text": "Mahalakshmi. S.N.",
      "value": "1295"
    },
    {
      "text": "Mahalakshmi. S.N.",
      "value": "1286"
    },
    {
      "text": "Mahalaxmi. K. R.",
      "value": "443"
    },
    {
      "text": "Mahendiran. C.",
      "value": "178"
    },
    {
      "text": "Maheswari. R",
      "value": "476"
    },
    {
      "text": "Mala. T.",
      "value": "256"
    },
    {
      "text": "Mala John.",
      "value": "407"
    },
    {
      "text": "Malar Mohan . K.",
      "value": "206"
    },
    {
      "text": "malar mohan. K.",
      "value": "563"
    },
    {
      "text": "Malar Mohan. K.",
      "value": "587"
    },
    {
      "text": "Malathi. K.",
      "value": "315"
    },
    {
      "text": "Malini. M.",
      "value": "960"
    },
    {
      "text": "Manamalli. D",
      "value": "971"
    },
    {
      "text": "Manamalli. D.",
      "value": "972"
    },
    {
      "text": "Manamalli. D.",
      "value": "395"
    },
    {
      "text": "Mandhakini. M.",
      "value": "61"
    },
    {
      "text": "MANDHAKINI. M",
      "value": "1094"
    },
    {
      "text": "Mandhakini. M.",
      "value": "932"
    },
    {
      "text": "MANGAIYARKARASI. S.P.",
      "value": "614"
    },
    {
      "text": "MANGAIYARKARASI. S.P",
      "value": "543"
    },
    {
      "text": "MANI RAJAN. M. S.",
      "value": "905"
    },
    {
      "text": "Manimala. K.",
      "value": "635"
    },
    {
      "text": "Manimala. K",
      "value": "636"
    },
    {
      "text": "manimala. K.",
      "value": "637"
    },
    {
      "text": "Manimegalai. S.",
      "value": "1148"
    },
    {
      "text": "Manimekalai. T.",
      "value": "1294"
    },
    {
      "text": "Manimekalai. B.",
      "value": "242"
    },
    {
      "text": "Manimekalai. T.",
      "value": "358"
    },
    {
      "text": "Manisha Vidyavathy. S.",
      "value": "250"
    },
    {
      "text": "Manisha Vidyavathy. S.",
      "value": "251"
    },
    {
      "text": "Manisha Vidyavathy. S.",
      "value": "501"
    },
    {
      "text": "MANIVANNAN. A.",
      "value": "674"
    },
    {
      "text": "Manivannan Jeganathan. J.",
      "value": "180"
    },
    {
      "text": "Manju. V.S.",
      "value": "184"
    },
    {
      "text": "Manjula A.",
      "value": "590"
    },
    {
      "text": "Manohar. P",
      "value": "823"
    },
    {
      "text": "MARIAMMAL. K.",
      "value": "689"
    },
    {
      "text": "Marini. L.",
      "value": "1226"
    },
    {
      "text": "MARSHAL ANTHONI. S",
      "value": "1225"
    },
    {
      "text": "Mary Anita Rajam. V.",
      "value": "406"
    },
    {
      "text": "Meena Kumari. S.",
      "value": "226"
    },
    {
      "text": "Meenakshi. M.",
      "value": "357"
    },
    {
      "text": "MEENAKSHI . M.",
      "value": "775"
    },
    {
      "text": "Meenakshisundaram. S.",
      "value": "581"
    },
    {
      "text": "Meenakshisundaram. S.",
      "value": "46"
    },
    {
      "text": "MEENAKSHISUNDARAM. S",
      "value": "1140"
    },
    {
      "text": "Meenakshisundaram. S",
      "value": "1144"
    },
    {
      "text": "Meenakshisundaram. S.",
      "value": "736"
    },
    {
      "text": "Meenakshisundaram. S",
      "value": "584"
    },
    {
      "text": "Meenakshisundaram. S",
      "value": "582"
    },
    {
      "text": "meenakumari . s",
      "value": "601"
    },
    {
      "text": "Meenakumari. S.",
      "value": "600"
    },
    {
      "text": "Meenakumari. S",
      "value": "934"
    },
    {
      "text": "Meenakumari. S",
      "value": "906"
    },
    {
      "text": "Meenu . P.",
      "value": "1041"
    },
    {
      "text": "Meenu . P",
      "value": "1042"
    },
    {
      "text": "MEGANATHAN. D",
      "value": "1095"
    },
    {
      "text": "Meraline Selvaraj .",
      "value": "1203"
    },
    {
      "text": "Meraline Selvaraj .",
      "value": "1204"
    },
    {
      "text": "Merline Sheela. A.",
      "value": "362"
    },
    {
      "text": "Merlyn Sujatha. R.",
      "value": "203"
    },
    {
      "text": "Meyyappan. S.",
      "value": "653"
    },
    {
      "text": "Meyyappan. S.",
      "value": "346"
    },
    {
      "text": "Mithrinthaa. S.",
      "value": "946"
    },
    {
      "text": "Mohamed Fathimal. P.",
      "value": "798"
    },
    {
      "text": "Mohan. D.",
      "value": "186"
    },
    {
      "text": "mohan lal. D.",
      "value": "678"
    },
    {
      "text": "Mohanlal. D.",
      "value": "145"
    },
    {
      "text": "Mohanraj. P.",
      "value": "1254"
    },
    {
      "text": "Monisha Mary . L.",
      "value": "204"
    },
    {
      "text": "Monsingh D.Devadas.",
      "value": "1129"
    },
    {
      "text": "Mookambiga. A.",
      "value": "1022"
    },
    {
      "text": "Moorthy Babu. S.",
      "value": "135"
    },
    {
      "text": "Moscow. S.",
      "value": "361"
    },
    {
      "text": "Mrs Kanimozhi. R",
      "value": "1212"
    },
    {
      "text": "Mudgal. B.V",
      "value": "1155"
    },
    {
      "text": "Mugendiran. V.",
      "value": "774"
    },
    {
      "text": "Mugendiran. V.",
      "value": "210"
    },
    {
      "text": "Mugendiran. V.",
      "value": "904"
    },
    {
      "text": "Murali. K",
      "value": "449"
    },
    {
      "text": "Murali. K",
      "value": "198"
    },
    {
      "text": "MURALIRAJAN. K.",
      "value": "625"
    },
    {
      "text": "Muruganandhan. R.",
      "value": "955"
    },
    {
      "text": "Muruganandhan. R.",
      "value": "274"
    },
    {
      "text": "Murugaraj. R.",
      "value": "669"
    },
    {
      "text": "MURUGESA PANDIAN . M.",
      "value": "710"
    },
    {
      "text": "Murugesa Pandian . M.",
      "value": "555"
    },
    {
      "text": "MURUGESA PANDIAN . M.",
      "value": "553"
    },
    {
      "text": "Murugeswari. A.",
      "value": "63"
    },
    {
      "text": "Muthu Mareeswaran . P.",
      "value": "628"
    },
    {
      "text": "MUTHU MEKALA. N.",
      "value": "917"
    },
    {
      "text": "Muthukumar. K.",
      "value": "672"
    },
    {
      "text": "MUTHUKUMARAN. S.",
      "value": "615"
    },
    {
      "text": "Muthukumaran. S.",
      "value": "215"
    },
    {
      "text": "Muthurajkumar. S.",
      "value": "799"
    },
    {
      "text": "Muthurajkumar. S.",
      "value": "663"
    },
    {
      "text": "Muthurajkumar. S.",
      "value": "231"
    },
    {
      "text": "Muthuselvam. P",
      "value": "469"
    },
    {
      "text": "Muttan. S.",
      "value": "418"
    },
    {
      "text": "Mutton. S",
      "value": "819"
    },
    {
      "text": "Mythili. C.",
      "value": "2"
    },
    {
      "text": "Mythily. M.",
      "value": "295"
    },
    {
      "text": "Nagaraaj. P.",
      "value": "342"
    },
    {
      "text": "Nagaraaj. P.",
      "value": "50"
    },
    {
      "text": "Nagarajan. V.A.",
      "value": "193"
    },
    {
      "text": "Nagarajan. G.",
      "value": "139"
    },
    {
      "text": "Nagendra Gandhi. N.",
      "value": "349"
    },
    {
      "text": "Nalini. S.",
      "value": "114"
    },
    {
      "text": "Namagal. S.",
      "value": "120"
    },
    {
      "text": "Nancy Jane. Y",
      "value": "522"
    },
    {
      "text": "Nancy Jane. Y.",
      "value": "424"
    },
    {
      "text": "Nancy Jane. Y.",
      "value": "520"
    },
    {
      "text": "Nandakumar. C.",
      "value": "294"
    },
    {
      "text": "NANDAKUMAR. C.",
      "value": "195"
    },
    {
      "text": "NANDAKUMAR. C.",
      "value": "1011"
    },
    {
      "text": "Nandhini. K.",
      "value": "869"
    },
    {
      "text": "Nandhini . R.",
      "value": "577"
    },
    {
      "text": "Nandhini . R.",
      "value": "576"
    },
    {
      "text": "Nandhini . R.",
      "value": "575"
    },
    {
      "text": "Nandhini. S.",
      "value": "633"
    },
    {
      "text": "Nandhini Devi. G.",
      "value": "101"
    },
    {
      "text": "Narayana Kalkura. S.",
      "value": "19"
    },
    {
      "text": "Narayanan. R.B",
      "value": "1161"
    },
    {
      "text": "Nasrutheen Sha. K",
      "value": "1138"
    },
    {
      "text": "Nasrutheen Sha. K",
      "value": "1135"
    },
    {
      "text": "Nasrutheen Sha. K.",
      "value": "1137"
    },
    {
      "text": "Nasrutheen Sha. K",
      "value": "1136"
    },
    {
      "text": "Natarajan. E.",
      "value": "17"
    },
    {
      "text": "Nathezhtha. T",
      "value": "1298"
    },
    {
      "text": "Nava Barathy. M.",
      "value": "1248"
    },
    {
      "text": "Navamuniyammal. M.",
      "value": "468"
    },
    {
      "text": "Neelakandan. R",
      "value": "1028"
    },
    {
      "text": "Neelakandan. R.",
      "value": "341"
    },
    {
      "text": "Neelakandan. R.",
      "value": "1029"
    },
    {
      "text": "Neelamalar. M.",
      "value": "69"
    },
    {
      "text": "Neelavathy Pari. S",
      "value": "244"
    },
    {
      "text": "Neelavathy Pari. S",
      "value": "1132"
    },
    {
      "text": "NIKITHA. M",
      "value": "1164"
    },
    {
      "text": "NIKITHA. M.",
      "value": "1163"
    },
    {
      "text": "Niranjali Devaraj. S.",
      "value": "832"
    },
    {
      "text": "Nirmala. J. P.",
      "value": "1238"
    },
    {
      "text": "Nirmala Devi. S.",
      "value": "260"
    },
    {
      "text": "Nirmala Devi. S",
      "value": "822"
    },
    {
      "text": "Nivvya. S J",
      "value": "918"
    },
    {
      "text": "Nupoor chowdhary .",
      "value": "1128"
    },
    {
      "text": "Omkumar. M",
      "value": "693"
    },
    {
      "text": "Omkumar. M.",
      "value": "440"
    },
    {
      "text": "Omkumar. M.",
      "value": "690"
    },
    {
      "text": "Omkumar. M",
      "value": "694"
    },
    {
      "text": "Omkumar. M",
      "value": "698"
    },
    {
      "text": "Omkumar. M",
      "value": "695"
    },
    {
      "text": "Omkumar. M",
      "value": "691"
    },
    {
      "text": "Pabitha. P.",
      "value": "551"
    },
    {
      "text": "Pabitha. P.",
      "value": "550"
    },
    {
      "text": "Padmanabhan. K.A.",
      "value": "1075"
    },
    {
      "text": "Padmanabhan Panchu. K.",
      "value": "899"
    },
    {
      "text": "PADMAVATHI. T.",
      "value": "599"
    },
    {
      "text": "Padmavathi. T.",
      "value": "248"
    },
    {
      "text": "Palanivelu. K.",
      "value": "71"
    },
    {
      "text": "PALPANDI. B.",
      "value": "979"
    },
    {
      "text": "Pandian Rajesh.",
      "value": "85"
    },
    {
      "text": "Pandiyarajan. V.",
      "value": "390"
    },
    {
      "text": "Pandurangan. A.",
      "value": "150"
    },
    {
      "text": "Pappa. N.",
      "value": "262"
    },
    {
      "text": "Paramasivam. K.M.",
      "value": "45"
    },
    {
      "text": "PARAMESHWARI. R",
      "value": "1216"
    },
    {
      "text": "PARAMESHWARI. R.",
      "value": "891"
    },
    {
      "text": "PARAMESHWARI. R.",
      "value": "890"
    },
    {
      "text": "PARAMMASIVAM . K. M.",
      "value": "878"
    },
    {
      "text": "Parimala Renganayaki. S.",
      "value": "1160"
    },
    {
      "text": "PATCHAI MURUGAN. K.",
      "value": "1173"
    },
    {
      "text": "Pavithra. E.",
      "value": "769"
    },
    {
      "text": "Pavithra. N.",
      "value": "1014"
    },
    {
      "text": "Perarasu. V .T.",
      "value": "1024"
    },
    {
      "text": "Pirabaharan. P.",
      "value": "534"
    },
    {
      "text": "Ponmalar. V.",
      "value": "548"
    },
    {
      "text": "Ponmalar. V.",
      "value": "306"
    },
    {
      "text": "Ponmalar. V.",
      "value": "307"
    },
    {
      "text": "Ponnusammy. V.",
      "value": "831"
    },
    {
      "text": "Ponsy R K Sathia Bhama.",
      "value": "364"
    },
    {
      "text": "Pooja. D. G",
      "value": "535"
    },
    {
      "text": "POONGUZHALI. S.",
      "value": "81"
    },
    {
      "text": "Poonguzhali. S.",
      "value": "237"
    },
    {
      "text": "Poonguzhali. S.",
      "value": "331"
    },
    {
      "text": "Poonguzhali. S",
      "value": "875"
    },
    {
      "text": "Poonguzhali . S",
      "value": "510"
    },
    {
      "text": "Poonguzhali. S",
      "value": "513"
    },
    {
      "text": "PRABAKAR. B.",
      "value": "1077"
    },
    {
      "text": "Prabakaran. R",
      "value": "1213"
    },
    {
      "text": "Prabakaran. R",
      "value": "1215"
    },
    {
      "text": "Prabhakaran. R.",
      "value": "1289"
    },
    {
      "text": "PRABHAKARAN. C.",
      "value": "1019"
    },
    {
      "text": "Prabhavathy. P.",
      "value": "794"
    },
    {
      "text": "Pradeep Kumar. M.",
      "value": "207"
    },
    {
      "text": "Pradeep Kumar. M.",
      "value": "252"
    },
    {
      "text": "Prakash. J.",
      "value": "13"
    },
    {
      "text": "PRAKASH. P.",
      "value": "1124"
    },
    {
      "text": "PRASANNA. J.",
      "value": "618"
    },
    {
      "text": "PRATHEEP MOSES. K",
      "value": "980"
    },
    {
      "text": "Pratheep Moses. K.",
      "value": "275"
    },
    {
      "text": "Praveena. V.",
      "value": "1279"
    },
    {
      "text": "Preethi. J",
      "value": "1296"
    },
    {
      "text": "Preethi Ramadoss.",
      "value": "117"
    },
    {
      "text": "Preethi Regunathan.",
      "value": "1151"
    },
    {
      "text": "Premalatha. K.",
      "value": "322"
    },
    {
      "text": "Premkumar . S",
      "value": "1178"
    },
    {
      "text": "Premkumar. S.",
      "value": "1179"
    },
    {
      "text": "Premkumar. S.",
      "value": "1177"
    },
    {
      "text": "Priyadharshini. R",
      "value": "83"
    },
    {
      "text": "PRIYADHARSHINI. N.",
      "value": "965"
    },
    {
      "text": "PRIYAVARTHINI. S.",
      "value": "645"
    },
    {
      "text": "Pugalenthi. V",
      "value": "431"
    },
    {
      "text": "Punitha. S",
      "value": "78"
    },
    {
      "text": "Puratchikodi. A.",
      "value": "321"
    },
    {
      "text": "Puratchikody. A.",
      "value": "1234"
    },
    {
      "text": "Pushpalatha. V",
      "value": "785"
    },
    {
      "text": "Pushpalatha. V.",
      "value": "786"
    },
    {
      "text": "Pushpalatha. V",
      "value": "787"
    },
    {
      "text": "Radha. K. V.",
      "value": "382"
    },
    {
      "text": "RADHA. M",
      "value": "1092"
    },
    {
      "text": "RADHA. K.V.",
      "value": "621"
    },
    {
      "text": "Radha Perumal . R",
      "value": "473"
    },
    {
      "text": "Radha Perumal Ramasamy.",
      "value": "290"
    },
    {
      "text": "Radha Senthilkumar. N. A.",
      "value": "365"
    },
    {
      "text": "Radha Sethilkumar.",
      "value": "507"
    },
    {
      "text": "Radhaperumal. R.",
      "value": "155"
    },
    {
      "text": "Raghuveera. T.",
      "value": "122"
    },
    {
      "text": "RAHIMA SHABEEN. S.",
      "value": "929"
    },
    {
      "text": "Rahima Shabeen. S.",
      "value": "313"
    },
    {
      "text": "Raj Kumar. R.",
      "value": "961"
    },
    {
      "text": "RAJA. S",
      "value": "566"
    },
    {
      "text": "RAJA. S",
      "value": "567"
    },
    {
      "text": "Rajadurai. P",
      "value": "742"
    },
    {
      "text": "Rajagopalan. V.",
      "value": "1199"
    },
    {
      "text": "RAJAGOPALAN. V",
      "value": "1210"
    },
    {
      "text": "Rajaguru. P.",
      "value": "74"
    },
    {
      "text": "Rajakumar. S",
      "value": "1142"
    },
    {
      "text": "Rajakumar. S",
      "value": "809"
    },
    {
      "text": "Rajalakshmi. P.R.",
      "value": "11"
    },
    {
      "text": "Rajalakshmi. S.",
      "value": "151"
    },
    {
      "text": "RAJANANDHINI. VM",
      "value": "1250"
    },
    {
      "text": "Rajarajeswari. G R",
      "value": "524"
    },
    {
      "text": "Rajarajeswari. G.R",
      "value": "999"
    },
    {
      "text": "Rajasekar. K.",
      "value": "1292"
    },
    {
      "text": "Rajasekar . K.",
      "value": "1277"
    },
    {
      "text": "Rajasekar. K.",
      "value": "1272"
    },
    {
      "text": "RAJASEKARAN. S.",
      "value": "544"
    },
    {
      "text": "Rajasekaran. S.",
      "value": "211"
    },
    {
      "text": "RAJASEKARAN. S.",
      "value": "545"
    },
    {
      "text": "Rajasekaran. S.",
      "value": "1197"
    },
    {
      "text": "RAJASEKARAN. S",
      "value": "1233"
    },
    {
      "text": "Rajasekaran Subbiah. S.",
      "value": "172"
    },
    {
      "text": "Rajendran. N.",
      "value": "168"
    },
    {
      "text": "Rajendran. N.",
      "value": "278"
    },
    {
      "text": "Rajendran. N.",
      "value": "267"
    },
    {
      "text": "Rajesh. G.",
      "value": "660"
    },
    {
      "text": "Rajesh. J.",
      "value": "595"
    },
    {
      "text": "Rajesh. J.",
      "value": "596"
    },
    {
      "text": "RAJESH. G. M.",
      "value": "975"
    },
    {
      "text": "Rajesh babu.",
      "value": "1115"
    },
    {
      "text": "Rajkumar. K.",
      "value": "684"
    },
    {
      "text": "Rajmohan. M.",
      "value": "924"
    },
    {
      "text": "Ramachandran. A.",
      "value": "835"
    },
    {
      "text": "Ramachandran Pal Pandi Raja.",
      "value": "47"
    },
    {
      "text": "Ramadass. N.",
      "value": "239"
    },
    {
      "text": "Ramajothi. J.",
      "value": "88"
    },
    {
      "text": "Ramakrishna. P.V.",
      "value": "53"
    },
    {
      "text": "Ramakrishnan. S.S",
      "value": "740"
    },
    {
      "text": "Ramakrishnan. S.S.",
      "value": "9"
    },
    {
      "text": "Ramalingam. S",
      "value": "1143"
    },
    {
      "text": "Ramalingam. S.",
      "value": "103"
    },
    {
      "text": "Ramana Rao. Y. V.",
      "value": "430"
    },
    {
      "text": "Ramasamy. M.S.",
      "value": "764"
    },
    {
      "text": "Rameeza Parveen. A.",
      "value": "962"
    },
    {
      "text": "Ramesh. K.",
      "value": "142"
    },
    {
      "text": "Ramesh. R.",
      "value": "376"
    },
    {
      "text": "Ramesh. K",
      "value": "1274"
    },
    {
      "text": "RAMESH. R.",
      "value": "1025"
    },
    {
      "text": "Ramesh Babu. T.",
      "value": "887"
    },
    {
      "text": "RAMESH KANNAN. M.",
      "value": "925"
    },
    {
      "text": "RAMESH KANNAN. M",
      "value": "927"
    },
    {
      "text": "RAMESH KANNAN. M",
      "value": "928"
    },
    {
      "text": "RAMESH KANNAN. M",
      "value": "926"
    },
    {
      "text": "Ramesh Kumar. G.",
      "value": "66"
    },
    {
      "text": "Ramji. V.",
      "value": "936"
    },
    {
      "text": "Ramprabhu. S.",
      "value": "624"
    },
    {
      "text": "Ranee Vedamuthu.",
      "value": "192"
    },
    {
      "text": "Ranjani Parthasarathi.",
      "value": "437"
    },
    {
      "text": "Rashia Begum. S.",
      "value": "257"
    },
    {
      "text": "Rathinasamy. A",
      "value": "1085"
    },
    {
      "text": "Rathnakannan. K.",
      "value": "93"
    },
    {
      "text": "Ravichandran. S.",
      "value": "810"
    },
    {
      "text": "Ravichandran. K.",
      "value": "444"
    },
    {
      "text": "RAVICHANDRAN. K",
      "value": "680"
    },
    {
      "text": "RaviKumar. G.",
      "value": "734"
    },
    {
      "text": "Ravishankar Krishna.",
      "value": "749"
    },
    {
      "text": "Regan. R.",
      "value": "298"
    },
    {
      "text": "REGAN. R.",
      "value": "1241"
    },
    {
      "text": "Renganathan. S.",
      "value": "445"
    },
    {
      "text": "Rengasamy. M.",
      "value": "434"
    },
    {
      "text": "RENGASAMY. M.",
      "value": "1205"
    },
    {
      "text": "Renugadevi . S",
      "value": "1246"
    },
    {
      "text": "Renuka. S.M.",
      "value": "617"
    },
    {
      "text": "Renuka. S.M.",
      "value": "273"
    },
    {
      "text": "Renuka Devi. P.",
      "value": "374"
    },
    {
      "text": "Renuka Devi. P.",
      "value": "1117"
    },
    {
      "text": "Resmi M.R.",
      "value": "712"
    },
    {
      "text": "Revathi. S.",
      "value": "183"
    },
    {
      "text": "REVATHY. V.R.",
      "value": "604"
    },
    {
      "text": "RIJUVANA BEGUM. A.",
      "value": "777"
    },
    {
      "text": "RIJUVANA BEGUM. A.",
      "value": "776"
    },
    {
      "text": "RIJUVANA BEGUM. A.",
      "value": "778"
    },
    {
      "text": "Rimmya. C.",
      "value": "285"
    },
    {
      "text": "Roselin. J.",
      "value": "106"
    },
    {
      "text": "Ruckmani. K.",
      "value": "508"
    },
    {
      "text": "RUCKMANI. K",
      "value": "561"
    },
    {
      "text": "Ruckmani. K.",
      "value": "146"
    },
    {
      "text": "Rukkumany. R. H.",
      "value": "1126"
    },
    {
      "text": "Sabena. S.",
      "value": "296"
    },
    {
      "text": "Sabitha Ramakrishnan.",
      "value": "176"
    },
    {
      "text": "Sabitha Ramakrishnan.",
      "value": "957"
    },
    {
      "text": "Sabitha Ramakrishnan.",
      "value": "956"
    },
    {
      "text": "Sakthinathan. G.",
      "value": "109"
    },
    {
      "text": "Sakthivadivel. R.",
      "value": "414"
    },
    {
      "text": "Sakthivel. P",
      "value": "475"
    },
    {
      "text": "Sambo. Akjss",
      "value": "1059"
    },
    {
      "text": "Samita Biswal.",
      "value": "18"
    },
    {
      "text": "Samita Biswal.",
      "value": "461"
    },
    {
      "text": "Samuel Raj. D.",
      "value": "132"
    },
    {
      "text": "Sandeep. J.",
      "value": "363"
    },
    {
      "text": "Sangeetha. D.",
      "value": "997"
    },
    {
      "text": "Sangeetha. D.",
      "value": "609"
    },
    {
      "text": "Sangeetha. D.",
      "value": "488"
    },
    {
      "text": "Sangeetha. D",
      "value": "1265"
    },
    {
      "text": "Sangeetha. D.",
      "value": "12"
    },
    {
      "text": "Sangeetha. S.",
      "value": "623"
    },
    {
      "text": "Sangeetha. D.",
      "value": "383"
    },
    {
      "text": "Sangeetha. D.",
      "value": "369"
    },
    {
      "text": "Sangeetha. P.",
      "value": "916"
    },
    {
      "text": "Sangeetha. D",
      "value": "489"
    },
    {
      "text": "Sangita. V",
      "value": "485"
    },
    {
      "text": "Sangita. V.",
      "value": "486"
    },
    {
      "text": "Sangita. V",
      "value": "484"
    },
    {
      "text": "Sangita Venkataraman.",
      "value": "272"
    },
    {
      "text": "Sangita Venkataraman.",
      "value": "213"
    },
    {
      "text": "Sanjeevi. S",
      "value": "479"
    },
    {
      "text": "Sanjib Kumar. Pattan",
      "value": "1183"
    },
    {
      "text": "Sanjib Kumar. Pattan",
      "value": "1182"
    },
    {
      "text": "Sankaran. K.",
      "value": "1170"
    },
    {
      "text": "Sanmuga Priya. E.",
      "value": "498"
    },
    {
      "text": "Sanmuga Priya. E.",
      "value": "1118"
    },
    {
      "text": "SANMUGA PRIYA. E.",
      "value": "167"
    },
    {
      "text": "Sanmuga Priya. E",
      "value": "499"
    },
    {
      "text": "Santhana Lakshmi. D.",
      "value": "935"
    },
    {
      "text": "SANTHANAKUMAR. M.",
      "value": "705"
    },
    {
      "text": "Santhiesh Kumar. V.",
      "value": "411"
    },
    {
      "text": "Santhosh Jeferson Stanley. J. S.",
      "value": "1171"
    },
    {
      "text": "Santhoshini Priya. T.",
      "value": "4"
    },
    {
      "text": "Santosh Baskaran.",
      "value": "829"
    },
    {
      "text": "SARADA. Y.",
      "value": "790"
    },
    {
      "text": "SARANYA. K.",
      "value": "119"
    },
    {
      "text": "SARANYA. R.",
      "value": "27"
    },
    {
      "text": "Saranya. K.",
      "value": "1258"
    },
    {
      "text": "Saranya Kuppuswamy.",
      "value": "602"
    },
    {
      "text": "Saraswathi. A.",
      "value": "335"
    },
    {
      "text": "Saravana Ram. R.",
      "value": "1224"
    },
    {
      "text": "Saravanakumar. A.",
      "value": "991"
    },
    {
      "text": "Saravanakumar. A.",
      "value": "723"
    },
    {
      "text": "Saravanan. R.",
      "value": "1158"
    },
    {
      "text": "Saravanan. K.",
      "value": "110"
    },
    {
      "text": "Saravanan. R.",
      "value": "134"
    },
    {
      "text": "Saravanan. R.",
      "value": "329"
    },
    {
      "text": "Saravanan. K.",
      "value": "605"
    },
    {
      "text": "Saravanan. R.",
      "value": "333"
    },
    {
      "text": "Saravanan. R.",
      "value": "334"
    },
    {
      "text": "Saravanan. K. K.",
      "value": "1114"
    },
    {
      "text": "Saravanan. K.",
      "value": "1243"
    },
    {
      "text": "Saravanan. R.",
      "value": "761"
    },
    {
      "text": "Saravanan K. K",
      "value": "1099"
    },
    {
      "text": "Saravanathamizhan. R.",
      "value": "20"
    },
    {
      "text": "SARAVANATHAMIZHAN. R",
      "value": "1262"
    },
    {
      "text": "Sarma Dhulipala. V.R.",
      "value": "99"
    },
    {
      "text": "Sarma Dhulipala. V. R.",
      "value": "583"
    },
    {
      "text": "Sarojadevi. M.",
      "value": "405"
    },
    {
      "text": "Sashikkumar. M.C.",
      "value": "930"
    },
    {
      "text": "Sasikala. M.",
      "value": "80"
    },
    {
      "text": "Sasikala. M.",
      "value": "332"
    },
    {
      "text": "Sasikala Ganapathy.",
      "value": "108"
    },
    {
      "text": "Sasirekha. N. R.",
      "value": "750"
    },
    {
      "text": "Saswathi Mukerjee.",
      "value": "391"
    },
    {
      "text": "Sathiesh Kumar. V.",
      "value": "160"
    },
    {
      "text": "SATHISH. S.",
      "value": "780"
    },
    {
      "text": "Sathish Gandhi. V. C.",
      "value": "435"
    },
    {
      "text": "Sathish Kumar . P.",
      "value": "459"
    },
    {
      "text": "Sathivel. P",
      "value": "474"
    },
    {
      "text": "Sathiya Moorthy. R",
      "value": "1101"
    },
    {
      "text": "SEKAR. K",
      "value": "1208"
    },
    {
      "text": "SEKAR. K",
      "value": "1207"
    },
    {
      "text": "Sekar. K.",
      "value": "156"
    },
    {
      "text": "Selladurai. S.",
      "value": "428"
    },
    {
      "text": "Selvamani. P.",
      "value": "166"
    },
    {
      "text": "Selvamani. P.",
      "value": "493"
    },
    {
      "text": "Selvamani. P",
      "value": "490"
    },
    {
      "text": "Selvaraj. V.",
      "value": "353"
    },
    {
      "text": "Selvaraj. V.",
      "value": "724"
    },
    {
      "text": "Selvi Ravindran.",
      "value": "1190"
    },
    {
      "text": "Selvi Ravindran.",
      "value": "438"
    },
    {
      "text": "Sendhilkumar. S.",
      "value": "967"
    },
    {
      "text": "Sendhilkumar. S.",
      "value": "968"
    },
    {
      "text": "Sendhilkumar. S.",
      "value": "392"
    },
    {
      "text": "Senthamil Selvan. P.",
      "value": "446"
    },
    {
      "text": "Senthamil Selvan. P.",
      "value": "1119"
    },
    {
      "text": "Senthamizh Raja. S.",
      "value": "1010"
    },
    {
      "text": "Senthamizh Raja. S",
      "value": "992"
    },
    {
      "text": "Senthil. R.",
      "value": "323"
    },
    {
      "text": "Senthil kumar. V.",
      "value": "704"
    },
    {
      "text": "Senthil kumar. V S",
      "value": "1106"
    },
    {
      "text": "Senthil Kumar. S.",
      "value": "1001"
    },
    {
      "text": "Senthil Kumar. P.",
      "value": "49"
    },
    {
      "text": "Senthil Kumar. C.",
      "value": "36"
    },
    {
      "text": "Senthil Kumar. M.",
      "value": "170"
    },
    {
      "text": "Senthil Kumar. K.",
      "value": "1"
    },
    {
      "text": "Senthil Kumar. V.S.",
      "value": "40"
    },
    {
      "text": "Senthil Vadivu. K.",
      "value": "350"
    },
    {
      "text": "Senthilkumar. S.",
      "value": "297"
    },
    {
      "text": "SENTHILKUMAR. S.",
      "value": "629"
    },
    {
      "text": "Senthilkumar. T.",
      "value": "316"
    },
    {
      "text": "SENTHILKUMAR. P.",
      "value": "726"
    },
    {
      "text": "Seshasayanan. R.",
      "value": "1167"
    },
    {
      "text": "Sethumadhavan. R.",
      "value": "41"
    },
    {
      "text": "SHAMILA. R.",
      "value": "1228"
    },
    {
      "text": "Shanker. K.V.",
      "value": "849"
    },
    {
      "text": "Shanmuga Priya. M.",
      "value": "140"
    },
    {
      "text": "Shanmuga Sundaram. K.",
      "value": "39"
    },
    {
      "text": "Shanmuga Sundaram. K",
      "value": "1111"
    },
    {
      "text": "Shanmuga Sundaram. K.",
      "value": "1112"
    },
    {
      "text": "Shanmugam. T.N",
      "value": "1166"
    },
    {
      "text": "Shanmugam. M.",
      "value": "200"
    },
    {
      "text": "Shanmugapriya. M",
      "value": "727"
    },
    {
      "text": "Shanmugapriya. E.",
      "value": "908"
    },
    {
      "text": "Shanmugapriya. E.",
      "value": "218"
    },
    {
      "text": "Shanmugapriya. E.",
      "value": "907"
    },
    {
      "text": "Shanmugapriya. E.",
      "value": "220"
    },
    {
      "text": "Shanmugapriya. M",
      "value": "947"
    },
    {
      "text": "Shanmugarathinam. A",
      "value": "720"
    },
    {
      "text": "Shanmugarathinam. A",
      "value": "1109"
    },
    {
      "text": "Shanmugarathinam. A.",
      "value": "562"
    },
    {
      "text": "Shanthi. K",
      "value": "737"
    },
    {
      "text": "Shanthi. C.",
      "value": "402"
    },
    {
      "text": "Shanthi. S.",
      "value": "511"
    },
    {
      "text": "SHANTHI. P.",
      "value": "981"
    },
    {
      "text": "Shanthi. S",
      "value": "512"
    },
    {
      "text": "Shanthi. S.",
      "value": "526"
    },
    {
      "text": "Shanthi. S.",
      "value": "234"
    },
    {
      "text": "Shanthi Subashchandran.",
      "value": "235"
    },
    {
      "text": "Sharmeela. C.",
      "value": "773"
    },
    {
      "text": "Sharmeela Chenniappan. C.",
      "value": "42"
    },
    {
      "text": "Sharmila Anishetty.",
      "value": "765"
    },
    {
      "text": "Shathanaa. R.",
      "value": "569"
    },
    {
      "text": "sheeja. R.Y.",
      "value": "1162"
    },
    {
      "text": "Sheeja. R. Y.",
      "value": "496"
    },
    {
      "text": "Sheeju Selva Roji. S.",
      "value": "1139"
    },
    {
      "text": "Shenbaga Devi. S.",
      "value": "31"
    },
    {
      "text": "Shenbaga Vinayaga Moorthi. N",
      "value": "288"
    },
    {
      "text": "SHIBU. G.",
      "value": "589"
    },
    {
      "text": "Shoba. P.",
      "value": "610"
    },
    {
      "text": "Shoba. P.",
      "value": "871"
    },
    {
      "text": "SHRINIDHI. S B",
      "value": "1270"
    },
    {
      "text": "Shubra Singh.",
      "value": "107"
    },
    {
      "text": "Shubra Singh.",
      "value": "483"
    },
    {
      "text": "Shubra Singh.",
      "value": "480"
    },
    {
      "text": "Siddharth. S.M.P.",
      "value": "647"
    },
    {
      "text": "SIDDHARTH. S.M.P",
      "value": "644"
    },
    {
      "text": "Siddharthan. A",
      "value": "701"
    },
    {
      "text": "Siddharthan. A.",
      "value": "129"
    },
    {
      "text": "Simi. V.S.",
      "value": "1156"
    },
    {
      "text": "Sittalatchoumy. R.",
      "value": "722"
    },
    {
      "text": "Siva Subramanian. S.",
      "value": "286"
    },
    {
      "text": "Sivakamasundari Pichu.",
      "value": "165"
    },
    {
      "text": "Sivakumar. T.",
      "value": "118"
    },
    {
      "text": "sivakumar. K.",
      "value": "670"
    },
    {
      "text": "Sivakumar. V.",
      "value": "144"
    },
    {
      "text": "Sivakumar. M",
      "value": "763"
    },
    {
      "text": "Sivanarutselvi. S.",
      "value": "830"
    },
    {
      "text": "Sivanesan. S",
      "value": "472"
    },
    {
      "text": "SIVANESAN. S.",
      "value": "169"
    },
    {
      "text": "Sivankalai. S.",
      "value": "1242"
    },
    {
      "text": "Sivaprakasam. A.",
      "value": "48"
    },
    {
      "text": "SIVARAJ. K.",
      "value": "547"
    },
    {
      "text": "Sivaraj. K.",
      "value": "546"
    },
    {
      "text": "Sivaraj. K.",
      "value": "141"
    },
    {
      "text": "Sivaramakrishnan. R.",
      "value": "452"
    },
    {
      "text": "Sivaramakrishnan. R.",
      "value": "422"
    },
    {
      "text": "Sivasubramanian. S.",
      "value": "627"
    },
    {
      "text": "Sivasubramanian. S.",
      "value": "137"
    },
    {
      "text": "Sivasubramanian. S",
      "value": "1184"
    },
    {
      "text": "Sivasubramanian. S",
      "value": "1189"
    },
    {
      "text": "Sivasubramanian. S",
      "value": "1188"
    },
    {
      "text": "Sm. Sm",
      "value": "1060"
    },
    {
      "text": "Sobha. L",
      "value": "738"
    },
    {
      "text": "Sobha. L.",
      "value": "26"
    },
    {
      "text": "SOMASUNDARAM. P.",
      "value": "1032"
    },
    {
      "text": "SOMASUNDARAM. P.",
      "value": "1033"
    },
    {
      "text": "SOMASUNDARAM. P",
      "value": "1231"
    },
    {
      "text": "Somasundharam. S.",
      "value": "709"
    },
    {
      "text": "Soorya Prakash. K.",
      "value": "1100"
    },
    {
      "text": "soorya Vennila .",
      "value": "1065"
    },
    {
      "text": "soorya Vennila .",
      "value": "1066"
    },
    {
      "text": "Soorya Vennila.",
      "value": "412"
    },
    {
      "text": "soorya Vennila .",
      "value": "1064"
    },
    {
      "text": "SOPHIA . M.",
      "value": "801"
    },
    {
      "text": "SOPHIA . M.",
      "value": "800"
    },
    {
      "text": "Soundara. B.",
      "value": "873"
    },
    {
      "text": "Soundaranayaki. K.",
      "value": "340"
    },
    {
      "text": "Soundiraraj. S",
      "value": "812"
    },
    {
      "text": "SOWMIYA. S.",
      "value": "998"
    },
    {
      "text": "Sree Renga Raja. T",
      "value": "1245"
    },
    {
      "text": "Sree Renga Raja. T.",
      "value": "1195"
    },
    {
      "text": "SREE SHARMILA. T.",
      "value": "622"
    },
    {
      "text": "Sreeja. B.S.",
      "value": "668"
    },
    {
      "text": "Sri Shalini. S.",
      "value": "28"
    },
    {
      "text": "SRIDARSHINI. T.",
      "value": "707"
    },
    {
      "text": "Sridhar. B.T.N.",
      "value": "754"
    },
    {
      "text": "Sridhar. S.",
      "value": "423"
    },
    {
      "text": "Sridharan. D.",
      "value": "1052"
    },
    {
      "text": "Srie Vidhya Janani. E.",
      "value": "1078"
    },
    {
      "text": "Sriharini. K.",
      "value": "1211"
    },
    {
      "text": "Srinivas. K",
      "value": "848"
    },
    {
      "text": "Srinivasa Raju. K.",
      "value": "10"
    },
    {
      "text": "Srinivasalu. S.",
      "value": "1168"
    },
    {
      "text": "Srinivasalu. S.",
      "value": "453"
    },
    {
      "text": "Srinivasan. K",
      "value": "814"
    },
    {
      "text": "SRINIVASAN. S",
      "value": "32"
    },
    {
      "text": "Srinivasan. S.",
      "value": "1036"
    },
    {
      "text": "SRINIVASAN. K.",
      "value": "990"
    },
    {
      "text": "Sriram. S.R.",
      "value": "711"
    },
    {
      "text": "Srividhya. G.",
      "value": "1230"
    },
    {
      "text": "Stalin. N",
      "value": "1287"
    },
    {
      "text": "Starvin. M S",
      "value": "1269"
    },
    {
      "text": "Starvin. M.S.",
      "value": "828"
    },
    {
      "text": "Starvin. M S",
      "value": "1268"
    },
    {
      "text": "Stephen. A.",
      "value": "859"
    },
    {
      "text": "STERLIN WICKLIFF. S.",
      "value": "1299"
    },
    {
      "text": "SUBHAGAR. S.",
      "value": "1063"
    },
    {
      "text": "Subhashini. S.",
      "value": "549"
    },
    {
      "text": "Subramani. T.",
      "value": "588"
    },
    {
      "text": "Subramani. T.",
      "value": "839"
    },
    {
      "text": "Subramanian. N.",
      "value": "79"
    },
    {
      "text": "Subramanian. S",
      "value": "826"
    },
    {
      "text": "Subramanian. K.",
      "value": "188"
    },
    {
      "text": "Sudha. S.",
      "value": "867"
    },
    {
      "text": "Sudha. J.",
      "value": "208"
    },
    {
      "text": "Sudha. J.",
      "value": "781"
    },
    {
      "text": "Sudha. J.",
      "value": "253"
    },
    {
      "text": "Sudha. S.",
      "value": "337"
    },
    {
      "text": "Sudha Rani. R.",
      "value": "1086"
    },
    {
      "text": "SUDHAKAR. T.",
      "value": "654"
    },
    {
      "text": "Sudhakar Gandhi. P.S",
      "value": "1154"
    },
    {
      "text": "Sudhanya. P.",
      "value": "98"
    },
    {
      "text": "Sudharson. G.",
      "value": "1047"
    },
    {
      "text": "Sugantha. A.",
      "value": "143"
    },
    {
      "text": "Sugantha.",
      "value": "457"
    },
    {
      "text": "Suganthi. L.",
      "value": "121"
    },
    {
      "text": "Suganyadevi. S",
      "value": "845"
    },
    {
      "text": "Suganyadevi. S.",
      "value": "554"
    },
    {
      "text": "Suja Priyadharsini. S.",
      "value": "282"
    },
    {
      "text": "Suja Priyadharsini. S.",
      "value": "1221"
    },
    {
      "text": "Suja Priyadharsini. S.",
      "value": "1220"
    },
    {
      "text": "Sujatha. C.M.",
      "value": "24"
    },
    {
      "text": "Sujatha Priyadharsini. P.R.",
      "value": "227"
    },
    {
      "text": "Sukumar. M",
      "value": "1097"
    },
    {
      "text": "SUKUMAR. M.",
      "value": "51"
    },
    {
      "text": "Sukumar. M",
      "value": "824"
    },
    {
      "text": "Sumalatha. M.R.",
      "value": "667"
    },
    {
      "text": "Sumalatha. M. R.",
      "value": "542"
    },
    {
      "text": "Sumathi. S",
      "value": "1280"
    },
    {
      "text": "SUMITHRA. S.",
      "value": "164"
    },
    {
      "text": "Sunitha Don Bosco.",
      "value": "416"
    },
    {
      "text": "Sunitha Don Bosco.",
      "value": "666"
    },
    {
      "text": "SUPRAJA. K. S.",
      "value": "1015"
    },
    {
      "text": "SUPRIYA. P.",
      "value": "986"
    },
    {
      "text": "Supriya. P.",
      "value": "240"
    },
    {
      "text": "Suresh. V",
      "value": "1240"
    },
    {
      "text": "Suresh Babu. A.",
      "value": "372"
    },
    {
      "text": "Suresh Babu. A. R.",
      "value": "327"
    },
    {
      "text": "SURESH KANNAN I.",
      "value": "897"
    },
    {
      "text": "Suresh Kumar. P.",
      "value": "115"
    },
    {
      "text": "Susila. P.",
      "value": "171"
    },
    {
      "text": "Susila. P.",
      "value": "613"
    },
    {
      "text": "Sutha. S.",
      "value": "263"
    },
    {
      "text": "Sutha. S",
      "value": "807"
    },
    {
      "text": "Sutha. S.",
      "value": "626"
    },
    {
      "text": "Sutha. S.",
      "value": "386"
    },
    {
      "text": "Suvro Chatterjee.",
      "value": "95"
    },
    {
      "text": "Swaminathan. M. R.",
      "value": "450"
    },
    {
      "text": "Swaminathan. M.R.",
      "value": "230"
    },
    {
      "text": "Swathi. M.",
      "value": "901"
    },
    {
      "text": "Swathi. M.",
      "value": "900"
    },
    {
      "text": "Syed Ahmed Kabeer. K. I.",
      "value": "881"
    },
    {
      "text": "Syed Ahmed Kabeer. K. I.",
      "value": "882"
    },
    {
      "text": "Tamil Elakkiya. V.",
      "value": "1288"
    },
    {
      "text": "Tamil Nidhi. M.",
      "value": "68"
    },
    {
      "text": "Tamilelakkiya Mathaiyan.",
      "value": "606"
    },
    {
      "text": "Tamilselvan. J.",
      "value": "97"
    },
    {
      "text": "Tamilselvan. J.",
      "value": "516"
    },
    {
      "text": "Tamilselvan. J",
      "value": "517"
    },
    {
      "text": "Tamilselvan Jayavelu.",
      "value": "420"
    },
    {
      "text": "Tamilselvi. R.",
      "value": "201"
    },
    {
      "text": "Test. M",
      "value": "818"
    },
    {
      "text": "Thamarai Selvi. S.",
      "value": "73"
    },
    {
      "text": "Thamil Magal. R.",
      "value": "354"
    },
    {
      "text": "Thanasekaran. K.",
      "value": "1165"
    },
    {
      "text": "Thanasekhar. B.",
      "value": "352"
    },
    {
      "text": "Thanasekhar. B.",
      "value": "1247"
    },
    {
      "text": "Thangapandian N. N.",
      "value": "1256"
    },
    {
      "text": "Thangaraj. V.",
      "value": "34"
    },
    {
      "text": "Thanigaiarasu. S.",
      "value": "185"
    },
    {
      "text": "The Coordinator.",
      "value": "697"
    },
    {
      "text": "The Director.",
      "value": "1266"
    },
    {
      "text": "Thendral Thiyagu. T.",
      "value": "533"
    },
    {
      "text": "THENDRALTHIYAKU. T.",
      "value": "708"
    },
    {
      "text": "Thenmuhil. D",
      "value": "982"
    },
    {
      "text": "Thenmuhil. D.",
      "value": "426"
    },
    {
      "text": "Thenmuhil. D.",
      "value": "515"
    },
    {
      "text": "Thilagavathi. R",
      "value": "746"
    },
    {
      "text": "Thilagavathi. j",
      "value": "919"
    },
    {
      "text": "Thilagavathi. R.",
      "value": "747"
    },
    {
      "text": "Thiruchelvi. A.",
      "value": "277"
    },
    {
      "text": "Thirumal Azhagan. M.",
      "value": "429"
    },
    {
      "text": "THIRUMALAIVASAN. D.",
      "value": "1285"
    },
    {
      "text": "Thirumalaivasan. D.",
      "value": "33"
    },
    {
      "text": "Thirumavalavan. K.",
      "value": "314"
    },
    {
      "text": "Thirumavalavan. K.",
      "value": "721"
    },
    {
      "text": "Thirumuruga Poiyamozhi. M.V.V.",
      "value": "291"
    },
    {
      "text": "THIRUNEELAKANDAN. R.",
      "value": "656"
    },
    {
      "text": "Thiyagarajan. P.",
      "value": "751"
    },
    {
      "text": "Thulasi. S",
      "value": "1113"
    },
    {
      "text": "Thyagarajan. T.",
      "value": "175"
    },
    {
      "text": "Udhayakumar. C.",
      "value": "127"
    },
    {
      "text": "Udhayakumar. K.",
      "value": "1244"
    },
    {
      "text": "Uma. E.",
      "value": "573"
    },
    {
      "text": "Uma. E.",
      "value": "377"
    },
    {
      "text": "Uma. E.",
      "value": "514"
    },
    {
      "text": "Uma. E",
      "value": "572"
    },
    {
      "text": "Uma Maheshwari. B.",
      "value": "55"
    },
    {
      "text": "Uma Maheswari. O.",
      "value": "1098"
    },
    {
      "text": "Uma Maheswari. P.",
      "value": "221"
    },
    {
      "text": "Uma Maheswari. K.",
      "value": "574"
    },
    {
      "text": "Uma Maheswari. P.",
      "value": "219"
    },
    {
      "text": "Uma Maheswari. P.",
      "value": "580"
    },
    {
      "text": "Umadevi. G.",
      "value": "579"
    },
    {
      "text": "Umadevi. G.",
      "value": "233"
    },
    {
      "text": "Umamaheswari. S.",
      "value": "608"
    },
    {
      "text": "Umamaheswari. S",
      "value": "783"
    },
    {
      "text": "UMAMAHESWARI. A.",
      "value": "1054"
    },
    {
      "text": "Umamaheswari. S",
      "value": "782"
    },
    {
      "text": "Umamaheswari. O.",
      "value": "196"
    },
    {
      "text": "Umamaheswari. S.",
      "value": "370"
    },
    {
      "text": "Umapathy. M.J.",
      "value": "834"
    },
    {
      "text": "Usha Antony.",
      "value": "153"
    },
    {
      "text": "USHA KINGSLY DEVI. K.",
      "value": "1023"
    },
    {
      "text": "Usha Natesan.",
      "value": "753"
    },
    {
      "text": "USHARANI. C.",
      "value": "702"
    },
    {
      "text": "Usharani. C.",
      "value": "700"
    },
    {
      "text": "Usharani. C.",
      "value": "703"
    },
    {
      "text": "V.R.Sarma Dhulipala.",
      "value": "1122"
    },
    {
      "text": "Vaidehi. V.",
      "value": "182"
    },
    {
      "text": "Vaishnavi. P.",
      "value": "441"
    },
    {
      "text": "VAISHNAVI KUMAR. P",
      "value": "1012"
    },
    {
      "text": "VAISHNAVI KUMAR. P",
      "value": "1013"
    },
    {
      "text": "Valarmathi. A.",
      "value": "492"
    },
    {
      "text": "Valarmathi. A.",
      "value": "113"
    },
    {
      "text": "Valli. S.",
      "value": "399"
    },
    {
      "text": "Vallisree. S.",
      "value": "1087"
    },
    {
      "text": "Valliyammai. C.",
      "value": "205"
    },
    {
      "text": "Valliyammai. C.",
      "value": "896"
    },
    {
      "text": "Vanaja Ranjan. P.",
      "value": "527"
    },
    {
      "text": "Vanitha. M.",
      "value": "1089"
    },
    {
      "text": "Varalakshmi. P.",
      "value": "194"
    },
    {
      "text": "Varalakshmi. P.",
      "value": "523"
    },
    {
      "text": "Varalakshmi. P.",
      "value": "381"
    },
    {
      "text": "VARSHA. A.",
      "value": "964"
    },
    {
      "text": "Vasanthan. B.",
      "value": "985"
    },
    {
      "text": "Vasanthi. D.",
      "value": "396"
    },
    {
      "text": "Vasim Babu. M.",
      "value": "715"
    },
    {
      "text": "Vasudevan. N.",
      "value": "425"
    },
    {
      "text": "Vasuhi. S.",
      "value": "394"
    },
    {
      "text": "VASUMATHI. M.",
      "value": "784"
    },
    {
      "text": "Vasumathi. M.",
      "value": "258"
    },
    {
      "text": "VASUPALLI THARUN.",
      "value": "1039"
    },
    {
      "text": "Vedhanayagam. M.",
      "value": "1264"
    },
    {
      "text": "Veena Selvam.",
      "value": "228"
    },
    {
      "text": "VEERALAKSHMI. S.",
      "value": "124"
    },
    {
      "text": "Velayutham. C.",
      "value": "417"
    },
    {
      "text": "VELMURUGAN. J.",
      "value": "959"
    },
    {
      "text": "velmurugan. T.",
      "value": "1291"
    },
    {
      "text": "velraj. R.",
      "value": "817"
    },
    {
      "text": "Velraj. G.",
      "value": "62"
    },
    {
      "text": "Velraj. R.",
      "value": "65"
    },
    {
      "text": "Velvizhy. P.",
      "value": "223"
    },
    {
      "text": "Velvizhy. P",
      "value": "945"
    },
    {
      "text": "Venkadesh. R",
      "value": "1061"
    },
    {
      "text": "Venkadesh. R.",
      "value": "1062"
    },
    {
      "text": "Venkata Ramanan. M.",
      "value": "1123"
    },
    {
      "text": "Venkatalakshmi. K.",
      "value": "398"
    },
    {
      "text": "Venkataramanan. M.",
      "value": "43"
    },
    {
      "text": "VENKATESAN. D.",
      "value": "699"
    },
    {
      "text": "Venkatesan. G.",
      "value": "1217"
    },
    {
      "text": "Venkatesan. M.",
      "value": "993"
    },
    {
      "text": "Venkatesan. V",
      "value": "1149"
    },
    {
      "text": "Venkatesan. G",
      "value": "86"
    },
    {
      "text": "Venkateshwaran. K.",
      "value": "458"
    },
    {
      "text": "Venugopal. S.",
      "value": "403"
    },
    {
      "text": "Vetha Potheher . I.",
      "value": "528"
    },
    {
      "text": "Vetriselvan. K.",
      "value": "1021"
    },
    {
      "text": "Vetriselvi. V.",
      "value": "190"
    },
    {
      "text": "Victor Jaya . N.",
      "value": "448"
    },
    {
      "text": "VIDHYA. R.",
      "value": "640"
    },
    {
      "text": "VIDHYA. R.",
      "value": "646"
    },
    {
      "text": "Vidhya. R.",
      "value": "393"
    },
    {
      "text": "VIDHYADEVI. U.",
      "value": "525"
    },
    {
      "text": "Vidjeapriya. R",
      "value": "1130"
    },
    {
      "text": "VIDJEAPRIYA. R.",
      "value": "312"
    },
    {
      "text": "VIDYA. K",
      "value": "953"
    },
    {
      "text": "Vidya. R",
      "value": "743"
    },
    {
      "text": "VIDYA. K.",
      "value": "30"
    },
    {
      "text": "VIDYA. K.",
      "value": "191"
    },
    {
      "text": "VIDYA. R.",
      "value": "177"
    },
    {
      "text": "VIDYA. R",
      "value": "788"
    },
    {
      "text": "Vidya. K.",
      "value": "467"
    },
    {
      "text": "Vidyalakshmi. Y.",
      "value": "808"
    },
    {
      "text": "Vidyalakshmi. Y.",
      "value": "264"
    },
    {
      "text": "VIGNESH. O.",
      "value": "885"
    },
    {
      "text": "VIJAYABALAJI. S.",
      "value": "611"
    },
    {
      "text": "Vijayabalaji. S.",
      "value": "351"
    },
    {
      "text": "Vijayakarthick. M.",
      "value": "345"
    },
    {
      "text": "Vijayakarthick. M.",
      "value": "630"
    },
    {
      "text": "VIJAYAKUMAR. S.",
      "value": "779"
    },
    {
      "text": "Vijayalakshmi. M.",
      "value": "279"
    },
    {
      "text": "Vijayalakshmi . M.",
      "value": "1194"
    },
    {
      "text": "Vijayalakshmidevi. S.R.",
      "value": "557"
    },
    {
      "text": "Vijayalaxmi. M.",
      "value": "1003"
    },
    {
      "text": "Vijayalaxmi. M.",
      "value": "977"
    },
    {
      "text": "Vijayarajan. P.",
      "value": "1008"
    },
    {
      "text": "Vijayarajan. P.",
      "value": "1009"
    },
    {
      "text": "Vijayarajan. P.",
      "value": "532"
    },
    {
      "text": "VIJAYASHREE. K.V.",
      "value": "1017"
    },
    {
      "text": "VIJAYKUMAR. V. R.",
      "value": "895"
    },
    {
      "text": "Vijaykumar . V R",
      "value": "1053"
    },
    {
      "text": "VIJAYKUMAR V R. V R",
      "value": "1198"
    },
    {
      "text": "Vimala Ramani.",
      "value": "791"
    },
    {
      "text": "Vimala Ramani.",
      "value": "675"
    },
    {
      "text": "VIMALANATHAN. K.",
      "value": "952"
    },
    {
      "text": "VINOD KUMAR. K.P.",
      "value": "105"
    },
    {
      "text": "Vinoth. N.",
      "value": "921"
    },
    {
      "text": "Vishista. K.",
      "value": "996"
    },
    {
      "text": "Vishista. K.",
      "value": "994"
    },
    {
      "text": "Vishista. K",
      "value": "477"
    },
    {
      "text": "Viswanath. G. S.",
      "value": "1070"
    },
    {
      "text": "Viswanathan . N.",
      "value": "35"
    },
    {
      "text": "VISWANATHAN. N",
      "value": "649"
    },
    {
      "text": "Vivek. G",
      "value": "1045"
    },
    {
      "text": "VOLGA. M.",
      "value": "1131"
    },
    {
      "text": "wgee. S.",
      "value": "688"
    },
    {
      "text": "Yogarathna. B",
      "value": "941"
    },
    {
      "text": "YUVARAJ. D.",
      "value": "1153"
    },
    {
      "text": "Yuvaraju. M",
      "value": "865"
    },
    {
      "text": "Yuvaraju. M",
      "value": "1281"
    },
    {
      "text": "YUVARAJU M. M",
      "value": "1282"
    }
  ];

const departments = [
    {
      "text": "Centre for Biotechnology",
      "value": "1"
    },
    {
      "text": "Centre for Environmental Studies",
      "value": "2"
    },
    {
      "text": "Centre for Food Technology",
      "value": "3"
    },
    {
      "text": "Centre for Medical Electronics",
      "value": "4"
    },
    {
      "text": "Centre for Nanoscience And Technology",
      "value": "5"
    },
    {
      "text": "Centre for Water Resources",
      "value": "6"
    },
    {
      "text": "Department of Aerospace Engineering",
      "value": "7"
    },
    {
      "text": "Department of Applied Science And Technology",
      "value": "8"
    },
    {
      "text": "Department of Automobile Engineering",
      "value": "9"
    },
    {
      "text": "Department of Bio-Technology",
      "value": "10"
    },
    {
      "text": "Department of Ceramic Technology",
      "value": "11"
    },
    {
      "text": "Department of Chemical Engineering",
      "value": "12"
    },
    {
      "text": "Department of Civil Engineering",
      "value": "13"
    },
    {
      "text": "Department of Computer Science and Engineering",
      "value": "14"
    },
    {
      "text": "Department of Computer Technology",
      "value": "15"
    },
    {
      "text": "Department of Electrical And Electronics Engineering",
      "value": "16"
    },
    {
      "text": "Department of Electronics And Communication Engineering",
      "value": "17"
    },
    {
      "text": "Department of Electronics Engineering",
      "value": "18"
    },
    {
      "text": "Department of Industrial Engineering",
      "value": "19"
    },
    {
      "text": "Department of Information Science And Technology",
      "value": "20"
    },
    {
      "text": "Department of Information Technology",
      "value": "21"
    },
    {
      "text": "Department of Instrumentation Engineering",
      "value": "22"
    },
    {
      "text": "Department of Manufacutring Engineering",
      "value": "23"
    },
    {
      "text": "Department of Mechanical Engineering",
      "value": "24"
    },
    {
      "text": "Department of Petrochemical Technology",
      "value": "25"
    },
    {
      "text": "Department of Printing and Packaging Technology",
      "value": "26"
    },
    {
      "text": "Department of Pharmaceutical Technology",
      "value": "27"
    },
    {
      "text": "Department of Physics",
      "value": "28"
    },
    {
      "text": "Department of Production Technology",
      "value": "29"
    },
    {
      "text": "Department of Rubber and Plastic Technology",
      "value": "30"
    },
    {
      "text": "Department of Textile Technology",
      "value": "31"
    },
    {
      "text": "Institute for Energy Studies",
      "value": "32"
    },
    {
      "text": "Department of Biomedical Engineering",
      "value": "33"
    },
    {
      "text": "Department of English",
      "value": "34"
    },
    {
      "text": "NHHID",
      "value": "35"
    },
    {
      "text": "Institute of Remote Sensing",
      "value": "36"
    },
    {
      "text": "Department of Chemistry",
      "value": "37"
    },
    {
      "text": "AU-FRG Institute for CAD/CAM",
      "value": "38"
    },
    {
      "text": "Department of Geology",
      "value": "39"
    },
    {
      "text": "Department of Mining Engineering",
      "value": "40"
    },
    {
      "text": "Centre for Crystal Growth Centre",
      "value": "41"
    },
    {
      "text": "Department of Media Science",
      "value": "42"
    },
    {
      "text": "Centre for Climate Change and Disaster Management",
      "value": "43"
    },
    {
      "text": "Siemens Centre of Excellence",
      "value": "44"
    },
    {
      "text": "Centre for AeroSpace Research",
      "value": "45"
    },
    {
      "text": "Department of Management Studies",
      "value": "46"
    },
    {
      "text": "Department of Medical Physics",
      "value": "47"
    },
    {
      "text": "AU-KBC Research Centre",
      "value": "48"
    },
    {
      "text": "Department of Mathematics",
      "value": "49"
    },
    {
      "text": "Department of Planning",
      "value": "50"
    },
    {
      "text": "Centre for Sponsored Research and Consultancy",
      "value": "51"
    },
    {
      "text": "Knowledge Data Centre",
      "value": "52"
    },
    {
      "text": "Institute of Ocean Management",
      "value": "53"
    },
    {
      "text": "Crystal Growth Centre",
      "value": "54"
    },
    {
      "text": "Department of Architecture",
      "value": "55"
    },
    {
      "text": "Centre for Excellence in Nanobio Translational Research",
      "value": "56"
    },
    {
      "text": "Ramanujan Computing Centre",
      "value": "57"
    },
    {
      "text": "Internal Audit-1",
      "value": "58"
    },
    {
      "text": "Department of Computer Application",
      "value": "59"
    },
    {
      "text": "Centre for University - Industry Collaboration",
      "value": "60"
    },
    {
      "text": "Centre for Intellectural Property Rights",
      "value": "61"
    },
    {
      "text": "TEC",
      "value": "62"
    },
    {
      "text": "Centre for Development of Tamil in Engineering and Technology",
      "value": "64"
    },
    {
      "text": "Centre for Energy Storage Technology",
      "value": "65"
    },
    {
      "text": "Centre for Energy Storage Technologies",
      "value": "66"
    },
    {
      "text": "Department of Chemistry, Dindigul",
      "value": "67"
    },
    {
      "text": "Centre for Wireless System Design",
      "value": "68"
    },
    {
      "text": "Centre for Cyber Security",
      "value": "69"
    },
    {
      "text": "Centre for Human Settlement",
      "value": "70"
    },
    {
      "text": "Centre for International Relations",
      "value": "71"
    },
    {
      "text": "Entrepreneurship Development and Innovation Council",
      "value": "72"
    },
    {
      "text": "Centre for Wireless System Design",
      "value": "73"
    },
    {
      "text": "Centre for Faculty & Professional Development",
      "value": "74"
    },
    {
      "text": "Centre for Climate Change and Disaster Management",
      "value": "75"
    },
    {
      "text": "Centre for Industrial Safety",
      "value": "76"
    },
    {
      "text": "Centre for Disaster Mitigation and Management",
      "value": "77"
    },
    {
      "text": "internal Quality Assurance cell",
      "value": "78"
    },
    {
      "text": "Centre for Entreprenurship Development",
      "value": "79"
    },
    {
      "text": "CENTRE FOR ADMISSIONS",
      "value": "80"
    },
    {
      "text": "The Controller of Examinations",
      "value": "81"
    },
    {
      "text": "Technology Enabling Centre",
      "value": "83"
    },
    {
      "text": "Centre for Energy Storage Technologies",
      "value": "84"
    },
    {
      "text": "Centre for Liberal Arit for science Engineeing Tevhnology",
      "value": "85"
    },
    {
      "text": "Centre for Materials Informatics c-main",
      "value": "86"
    },
    {
      "text": "Department of Applied Science and Humanities",
      "value": "87"
    },
    {
      "text": "National Hub for Healthcare Instrumentation Development",
      "value": "88"
    },
    {
      "text": "Centre for Robotics and Automation",
      "value": "89"
    },
    {
      "text": "Educational Multimedia Research Centre",
      "value": "90"
    },
    {
      "text": "Centre for Distance Education",
      "value": "91"
    },
    {
      "text": "Centre for Excellence Building",
      "value": "92"
    },
    {
      "text": "Centre for Artificial Intelligence and Data Science Researchh & Applications",
      "value": "93"
    },
    {
      "text": "Centre for Internet of things",
      "value": "94"
    },
    {
      "text": "Centre for Survey Training and Research",
      "value": "95"
    },
    {
      "text": "Centre for E-Vehicle Technology",
      "value": "96"
    },
    {
      "text": "Centre for Immersive Technologies",
      "value": "97"
    },
    {
      "text": "Institute of Catalysis and Petroleum Technology",
      "value": "98"
    },
    {
      "text": "Division of Nanoscience and Technology",
      "value": "99"
    },
    {
      "text": "Centre for Blended Learning and Human Empowerment",
      "value": "100"
    },
    {
      "text": "Centre for facuty Development programme",
      "value": "101"
    },
    {
      "text": "Department of Biochemistry",
      "value": "102"
    },
    {
      "text": "Centre for Climate Change and Adaptation Research",
      "value": "103"
    },
    {
      "text": "Centre for Composite Materials",
      "value": "104"
    },
    {
      "text": "CETRE FOR EXCELLECE IN AUTOMOBILE TECHNOLOGY",
      "value": "105"
    },
    {
      "text": "Building Technology Centre",
      "value": "106"
    },
    {
      "text": "Department of Management Studies",
      "value": "107"
    },
    {
      "text": "registrar",
      "value": "108"
    },
    {
      "text": "Dean",
      "value": "109"
    },
    {
      "text": "Centralized Procurement Office",
      "value": "110"
    },
    {
      "text": "DEAN CEG",
      "value": "111"
    },
    {
      "text": "Centre for Technology in Traditional Medicine",
      "value": "112"
    },
    {
      "text": "Anna University Sports Board",
      "value": "113"
    },
    {
      "text": "Planning & Development",
      "value": "114"
    },
    {
      "text": "Centre for Multi Disciplinary System Research",
      "value": "115"
    },
    {
      "text": "Centre for Alumni Relations and Corporate Affairs",
      "value": "116"
    },
    {
      "text": "Naan Mudhalvan",
      "value": "117"
    },
    {
      "text": "Engineering College Hostels",
      "value": "118"
    },
    {
      "text": "Energy Environment&Sustainability",
      "value": "119"
    },
    {
      "text": "Centre For Research",
      "value": "120"
    },
    {
      "text": "Vice Chancellor - Anna University",
      "value": "121"
    },
    {
      "text": "Department of Science & Humanities",
      "value": "122"
    },
    {
      "text": "Dr. Kalam Computing Centre",
      "value": "124"
    },
    {
      "text": "Centre for Entrance Examinations",
      "value": "125"
    },
    {
      "text": "Legal Office",
      "value": "126"
    },
    {
      "text": "Finance Office",
      "value": "127"
    },
    {
      "text": "Concurrent Audit",
      "value": "128"
    },
    {
      "text": "University Library",
      "value": "129"
    },
    {
      "text": "Department of NanoTechnology",
      "value": "130"
    },
    {
      "text": "Centre for Climate Change and Adaptation Research",
      "value": "131"
    }
  ];

const campuses = [
    {
      "text": "CEG Campus",
      "value": "1"
    },
    {
      "text": "ACT Campus",
      "value": "2"
    },
    {
      "text": "MIT Campus",
      "value": "3"
    },
    {
      "text": "Anna Universty Regional Centre, Tirunelveli",
      "value": "4"
    },
    {
      "text": "Bharathidasan Institute of Technology (BIT) Campus",
      "value": "5"
    },
    {
      "text": "University College of Engineering (VOC College of Engg.), Tuticorin",
      "value": "6"
    },
    {
      "text": "University College of Engineering, Nagercoil",
      "value": "7"
    },
    {
      "text": "University College of Engineering, Ramanathapuram",
      "value": "8"
    },
    {
      "text": "University College of Engineering, Thirukkuvalai",
      "value": "9"
    },
    {
      "text": "University College of Engineering, Pattukottai",
      "value": "10"
    },
    {
      "text": "Main Campus",
      "value": "11"
    },
    {
      "text": "University College of Engineering, Panruti",
      "value": "12"
    },
    {
      "text": "University College of Engineering, Arni",
      "value": "13"
    },
    {
      "text": "University College of Engineering, Tindivanam",
      "value": "14"
    },
    {
      "text": "University College of Engineering, Tirunelveli",
      "value": "15"
    },
    {
      "text": "University College of Engineering, Dindugal",
      "value": "16"
    },
    {
      "text": "University College of Engineering, Trichy",
      "value": "17"
    },
    {
      "text": "SAP Campus",
      "value": "18"
    },
    {
      "text": "University College of Engineering, Madurai",
      "value": "19"
    },
    {
      "text": "Regional Campus Coimbatore",
      "value": "21"
    },
    {
      "text": "University College of Engineering, Ariyalur",
      "value": "22"
    },
    {
      "text": "University College of Engineering Villupuram",
      "value": "23"
    },
    {
      "text": "University College of Engineering - Bharathidasan Institute of Technology, Tiruchirappalli.",
      "value": "25"
    },
    {
      "text": "Bharathidasan Institute of Technology (BIT) Campus",
      "value": "26"
    },
    {
      "text": "University College of Engineering - Dindigul",
      "value": "27"
    },
    {
      "text": "University College of Engineering - Kanchipuram",
      "value": "28"
    },
    {
      "text": "University College of Engineering, Villupuram",
      "value": "29"
    },
    {
      "text": "Anna University Regional Campus Madurai",
      "value": "30"
    }
  ];

// ── Dummy projects ─────────────────────────────────────────────────────────────
const initialProjects = [
  {
    id: 1,
    fileNo: "CMRG/2025/014",
    title: "AI Based Smart Agriculture",
    pi: "Dr. Arun Kumar",
    coPI1: "Dr. Meena Raj",
    coPI2: "",
    coPI3: "",
    department: "Information Science And Technology",
    campus: "CEG Campus",
    funding: "CMRG",
    scheme: "CRG",
    agencyType: "C",
    amount: "25,00,000",
    sanctionDate: "2023-04-01",
    endDate: "2025-03-31",
    status: "ongoing",
    closureSubmitted: false,
    closureData: null,
    closureStatus: null, // null | "under_review" | "approved"
  },
  {
    id: 2,
    fileNo: "CRG/2025/021",
    title: "IoT Smart Monitoring System",
    pi: "Dr. Priya Natarajan",
    coPI1: "Dr. Suresh K",
    coPI2: "",
    coPI3: "",
    department: "Computer Science and Engineering",
    campus: "MIT Campus",
    funding: "SERB",
    scheme: "Core Research Grant {CRG}",
    agencyType: "C",
    amount: "40,00,000",
    sanctionDate: "2022-06-15",
    endDate: "2024-06-14",
    status: "completed",
    closureSubmitted: false,
    closureData: null,
    closureStatus: null,
  },
  {
    id: 3,
    fileNo: "DST/2023/008",
    title: "Nano Material Synthesis for Energy Storage",
    pi: "Dr. Kavitha R.",
    coPI1: "",
    coPI2: "",
    coPI3: "",
    department: "Centre for Nanoscience And Technology",
    campus: "CEG Campus",
    funding: "DST",
    scheme: "SERB",
    agencyType: "C",
    amount: "18,50,000",
    sanctionDate: "2021-01-10",
    endDate: "2023-01-09",
    status: "closed",
    closureSubmitted: true,
    closureData: null,
    closureStatus: "approved",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusMeta = {
  ongoing: { label: "Ongoing", color: "#0d6efd", bg: "#e7f0ff" },
  completed: { label: "Completed", color: "#d97706", bg: "#fef3c7" },
  closed: { label: "Closed", color: "#15803d", bg: "#dcfce7" },
  under_review: { label: "Under Review", color: "#7c3aed", bg: "#f3f0ff" },
};

const ClosureStatus = ({ s }) => {
  const m = statusMeta[s] || statusMeta.ongoing;
  return (
    <span
      style={{
        background: m.bg,
        color: m.color,
        borderRadius: 20,
        padding: "4px 14px",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {m.label}
    </span>
  );
};

// Document checklist definition — single source of truth, used for both
// the on-screen checklist (with per-row upload) and the printable PDF.
const DOC_CHECKLIST = [
  { no: "1", label: "Project Sanction copy", key: "docProjectSanction" },
  { no: "2", label: "CTDT proceedings", key: "docCTDTProceedings" },
  { no: "3", label: "Project Extension letter", key: "docExtensionLetter" },
  { no: "4", label: "Utilization certificate copies (year wise)", key: "docUCYearwise" },
  { no: "5", label: "Utilization certificate copy Final", key: "docUCFinal" },
  { no: "6", label: "Reply to audit objection (if any)", key: "docAuditReply" },
  { no: "7", label: "Project Closure Report", key: "docCompletionReport" },
  { no: "8", label: "Unspent money return details (if any)", key: "docUnspentReturn" },
  { no: "9", label: "Publication (First page of publication)", key: "docPublication" },
  { no: "11", label: "Patent details", key: "docPatent" },
  { no: "12", label: "Conference/Seminar presented", key: "docConference" },
  { no: "13", label: "Project closure certificate received from Funding agency", key: "docClosureCert" },
  { no: "14", label: "Equipment stock register entry (copy) in case of equipment cost more than 10 Lakhs", key: "docStockRegister" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Filters panel (shared)
// ─────────────────────────────────────────────────────────────────────────────
function FiltersPanel({ filters, setFilters, onSearch, onReset }) {
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div className="rp-filters">
      <div className="rp-fh">
        <h2 className="rp-sec-title">Filters</h2>
        <span className="rp-sec-sub">Narrow your search</span>
      </div>
      <div className="rp-fgrid">
        <select value={filters.funding} onChange={set("funding")}>
          <option value="">Funding Agency</option>
          {fundingAgency.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <select value={filters.scheme} onChange={set("scheme")}>
          <option value="">Project Scheme</option>
          {projectScheme.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <select value={filters.agencyType} onChange={set("agencyType")}>
          <option value="">Agency Type</option>
          {agencyType.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <select value={filters.faculty} onChange={set("faculty")}>
          <option value="">Faculty Name</option>
          {facultyNames.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <select value={filters.department} onChange={set("department")}>
          <option value="">Department</option>
          {departments.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <select value={filters.campus} onChange={set("campus")}>
          <option value="">Campus</option>
          {campuses.map((x, i) => (
            <option key={i} value={x.value}>{x.text}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by title or file no."
          value={filters.q}
          onChange={set("q")}
          className="rp-search-input"
        />
      </div>
      <div className="rp-fdate">
        {[
          ["Sanction Date", "sanctionFrom", "sanctionTo"],
          ["Project End Date", "endFrom", "endTo"],
        ].map(([label, f, t]) => (
          <div className="rp-date-card" key={f}>
            <label>{label}</label>
            <div className="rp-di">
              <input type="date" value={filters[f]} onChange={set(f)} />
              <span style={{ color: "#94a3b8", fontSize: 13 }}>to</span>
              <input type="date" value={filters[t]} onChange={set(t)} />
            </div>
          </div>
        ))}
      </div>
      <div className="rp-factions">
        <button className="rp-btn-primary" onClick={onSearch}>Search</button>
        <button className="rp-btn-ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Project detail drawer
// ─────────────────────────────────────────────────────────────────────────────
function ProjectDrawer({ project, onClose, onSubmitClosure, onApproveClosure }) {
  if (!project) return null;
  const isCompleted = project.status === "completed";
  const isUnderReview = project.closureStatus === "under_review";
  const isClosed = project.status === "closed";

  return (
    <div className="rp-drawer-overlay" onClick={onClose}>
      <div className="rp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="rp-drawer-head">
          <div>
            <p className="rp-drawer-fileno">{project.fileNo}</p>
            <h2 className="rp-drawer-title">{project.title}</h2>
          </div>
          <button className="rp-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="rp-drawer-body">
          <div className="rp-detail-grid">
            {[
              ["Principal Investigator", project.pi],
              ["Co-PI 1", project.coPI1 || "—"],
              ["Co-PI 2", project.coPI2 || "—"],
              ["Co-PI 3", project.coPI3 || "—"],
              ["Department", project.department],
              ["Campus", project.campus],
              ["Funding Agency", project.funding],
              ["Scheme", project.scheme],
              ["Agency Type", agencyType.find(a => a.value === project.agencyType)?.text || project.agencyType],
              ["Sanction Amount", "₹" + project.amount],
              ["Sanction Date", project.sanctionDate],
              ["End Date", project.endDate],
            ].map(([k, v]) => (
              <div className="rp-detail-row" key={k}>
                <span className="rp-detail-key">{k}</span>
                <span className="rp-detail-val">{v}</span>
              </div>
            ))}
          </div>

          <div className="rp-status-row">
            <span className="rp-detail-key">Status</span>
            <ClosureStatus s={isUnderReview ? "under_review" : project.status} />
          </div>

          {isCompleted && !isUnderReview && (
            <button
              className="rp-btn-amber rp-mt"
              onClick={() => onSubmitClosure(project)}
            >
              Submit Project Closure Report
            </button>
          )}

          {isUnderReview && (
            <div className="rp-review-banner">
              <span>📋 Closure report submitted — awaiting office review.</span>
              {/* Admin action (can be hidden for PI role) */}
              <button className="rp-btn-green rp-ml" onClick={() => onApproveClosure(project.id)}>
                Approve (Office)
              </button>
            </div>
          )}

          {isClosed && (
            <div className="rp-closed-banner">
              ✅ Project closed. Closure report approved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Project list row
// ─────────────────────────────────────────────────────────────────────────────
function ProjectRow({ project, onClick, onSubmitClosure }) {
  const isCompleted = project.status === "completed";
  const isUnderReview = project.closureStatus === "under_review";
  const statusKey = isUnderReview ? "under_review" : project.status;

  return (
    <tr className="rp-row" onClick={() => onClick(project)}>
      <td className="rp-td rp-td-fileno">{project.fileNo}</td>
      <td className="rp-td">{project.title}</td>
      <td className="rp-td">{project.pi}</td>
      <td className="rp-td">{project.department}</td>
      <td className="rp-td">{project.campus}</td>
      <td className="rp-td rp-td-center">
        <ClosureStatus s={statusKey} />
      </td>
      <td className="rp-td rp-td-center" onClick={(e) => e.stopPropagation()}>
        {isCompleted && !isUnderReview && (
          <button
            className="rp-btn-amber-sm"
            onClick={() => onSubmitClosure(project)}
          >
            Submit Closure Report
          </button>
        )}
        {isUnderReview && (
          <span className="rp-tag-review">Under Review</span>
        )}
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Closure Report Form  (3-page form based on the actual CSRC paper form)
// ─────────────────────────────────────────────────────────────────────────────
const emptyForm = {
  // Page 1 – Project Details
  projectTitle: "",
  fundingAgency: "",
  national: "national",

  // PI — split into 3 distinct fields, as on the paper form
  piName: "",
  piDesignation: "",
  piAddress: "",

  // Co-PI 1 / 2 / 3 — each split into name / designation / address
  coPI1Name: "",
  coPI1Designation: "",
  coPI1Address: "",
  coPI2Name: "",
  coPI2Designation: "",
  coPI2Address: "",
  coPI3Name: "",
  coPI3Designation: "",
  coPI3Address: "",

  externalCollaborators: "no",
  moaSigned: "no",

  // Project details
  sanctionRef: "",
  projectDuration: "",
  budgetSanctioned: "",

  // Budget released — each instalment now also carries its own CTDT Proc No,
  // matching the paper form where "CTDT proc no" sits beside Date/Amount.
  installment1Amount: "",
  installment1Date: "",
  installment1Ctdt: "",
  installment2Amount: "",
  installment2Date: "",
  installment2Ctdt: "",
  installment3Amount: "",
  installment3Date: "",
  installment3Ctdt: "",

  majorEquipment: "no",
  equipmentCost: "",
  // Equipment stock-register entry block (S.No / Pg.No — both present, as on paper form)
  stockEntrySNo: "",
  stockEntryPgNo: "",
  stockRegisterEnclose: "no",

  extensionObtained: "no",
  extensionAgency: "",

  // Item 7 — Utilization Certificate (separate Yes/No question)
  utilizationCertificate: "no",

  // Item 8 — Percentage of Fund Utilization (separate I/II/III year %s)
  utilizationI: "",
  utilizationII: "",
  utilizationIII: "",

  // Page 2 – Completion details
  unspentReturned: "no",
  unspentAmount: "",
  unspentMode: "",
  auditObjection: "no",
  completionReportSubmitted: "no",
  closureCertificateReceived: "no",
  outcomeProduct: false,
  outcomePatent: false,
  outcomePublications: false,
  outcomePhD: false,
  trlLevel: "",
  piInterestedContinue: "no",

  // Documents (checklist) — yes/no/na per document
  docProjectSanction: "",
  docCTDTProceedings: "",
  docExtensionLetter: "",
  docUCYearwise: "",
  docUCFinal: "",
  docAuditReply: "",
  docCompletionReport: "",
  docUnspentReturn: "",
  docPublication: "",
  docPatent: "",
  docConference: "",
  docClosureCert: "",
  docStockRegister: "",

  // Uploads — keyed per document so each of the 14 rows has its own files
  uploadsByDoc: {},
};

function ClosureForm({ project, onClose, onSubmit }) {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    ...emptyForm,
    projectTitle: project.title,
    fundingAgency: project.funding,
    piName: project.pi,
    coPI1Name: project.coPI1 || "",
    coPI2Name: project.coPI2 || "",
    coPI3Name: project.coPI3 || "",
    budgetSanctioned: project.amount,
  });
  const [pdfBusy, setPdfBusy] = useState(false);
  const fileRefs = useRef({});

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const triggerUpload = (docKey) => {
    fileRefs.current[docKey]?.click();
  };

  const handleDocFiles = (docKey) => (e) => {
    const files = Array.from(e.target.files).map((f) => f.name);
    if (files.length === 0) return;
    setForm((p) => ({
      ...p,
      uploadsByDoc: {
        ...p.uploadsByDoc,
        [docKey]: [...(p.uploadsByDoc[docKey] || []), ...files],
      },
    }));
    e.target.value = "";
  };

  const removeDocFile = (docKey, idx) => {
    setForm((p) => {
      const list = [...(p.uploadsByDoc[docKey] || [])];
      list.splice(idx, 1);
      return { ...p, uploadsByDoc: { ...p.uploadsByDoc, [docKey]: list } };
    });
  };

  const handleSubmit = () => onSubmit(project.id, form);

  // ── PDF generation ──────────────────────────────────────────────────────
  // The printable node is rendered permanently in the DOM (off-screen, but
  // visible/laid-out) so html2canvas has real content + dimensions to
  // rasterize. Rendering it only "on demand" inside a closed/hidden tree
  // (display:none, or unmounted) is what produces blank PDFs.
  const downloadPDF = () => {
    const el = document.getElementById(`closure-pdf-content-${project.id}`);
    if (!el) return;
    setPdfBusy(true);
    const opts = {
      margin: 10,
      filename: `${project.fileNo.replace(/[\/\\]/g, "_")}_ClosureReport.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    html2pdf()
      .set(opts)
      .from(el)
      .save()
      .then(() => setPdfBusy(false))
      .catch(() => setPdfBusy(false));
  };

  const YNRadio = ({ name, val, onChange, label = "" }) => (
    <div className="rp-yn">
      {label && <span className="rp-yn-label">{label}</span>}
      {["yes", "no"].map((v) => (
        <label key={v} className="rp-yn-opt">
          <input type="radio" name={name} value={v} checked={val === v} onChange={onChange} />
          <span>{v === "yes" ? "Yes" : "No"}</span>
        </label>
      ))}
    </div>
  );

  // Checklist row with its own Yes/No/NA + its own upload control.
  const CheckDocRow = ({ no, label, fKey }) => {
    const files = form.uploadsByDoc[fKey] || [];
    return (
      <tr>
        <td className="rp-chtd rp-chtd-no">{no}</td>
        <td className="rp-chtd">{label}</td>
        {["yes", "no", "na"].map((v) => (
          <td key={v} className="rp-chtd rp-chtd-center">
            <input
              type="radio"
              name={fKey}
              value={v}
              checked={form[fKey] === v}
              onChange={set(fKey)}
            />
          </td>
        ))}
        <td className="rp-chtd rp-chtd-upload">
          <input
            ref={(node) => (fileRefs.current[fKey] = node)}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={handleDocFiles(fKey)}
          />
          <button
            type="button"
            className="rp-upload-pill"
            onClick={() => triggerUpload(fKey)}
          >
            📎 Upload
          </button>
          {files.length > 0 && (
            <div className="rp-upload-pill-list">
              {files.map((f, i) => (
                <span key={i} className="rp-upload-pill-file">
                  {f}
                  <button
                    type="button"
                    className="rp-upload-pill-remove"
                    onClick={() => removeDocFile(fKey, i)}
                    aria-label={`Remove ${f}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="rp-drawer-overlay">
      <div className="rp-modal rp-modal-lg">
        {/* Header */}
        <div className="rp-modal-head">
          <div>
            <p className="rp-drawer-fileno">{project.fileNo}</p>
            <h2 className="rp-drawer-title">Project Closure Report</h2>
          </div>
          <button className="rp-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Steps */}
        <div className="rp-steps">
          {["Project Details", "Completion Details", "Documents Checklist"].map((s, i) => (
            <div
              key={i}
              className={`rp-step ${page === i + 1 ? "rp-step-active" : page > i + 1 ? "rp-step-done" : ""}`}
            >
              <div className="rp-step-num">{page > i + 1 ? "✓" : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="rp-modal-body">

          {/* ── PAGE 1 ── */}
          {page === 1 && (
            <div>
              <h3 className="rp-form-section-title">A. Investigators Details</h3>
              <div className="rp-form-grid">
                <div className="rp-field-full">
                  <label>Project Title</label>
                  <input type="text" value={form.projectTitle} onChange={set("projectTitle")} />
                </div>
                <div>
                  <label>Funding Agency</label>
                  <input type="text" value={form.fundingAgency} onChange={set("fundingAgency")} />
                </div>
                <div>
                  <label>National / International</label>
                  <select value={form.national} onChange={set("national")}>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>

              {/* Principal Investigator — Name / Designation / Address as 3 distinct fields */}
              <p className="rp-sublabel rp-mt">Principal Investigator</p>
              <div className="rp-person-grid">
                <div>
                  <label>PI Name</label>
                  <input type="text" value={form.piName} onChange={set("piName")} placeholder="Name" />
                </div>
                <div>
                  <label>PI Designation</label>
                  <input type="text" value={form.piDesignation} onChange={set("piDesignation")} placeholder="Designation" />
                </div>
                <div>
                  <label>PI Address</label>
                  <input type="text" value={form.piAddress} onChange={set("piAddress")} placeholder="Address" />
                </div>
              </div>

              {/* Co-PI 1 */}
              <p className="rp-sublabel rp-mt">Co-PI 1</p>
              <div className="rp-person-grid">
                <div>
                  <label>Co-PI 1 Name</label>
                  <input type="text" value={form.coPI1Name} onChange={set("coPI1Name")} placeholder="Name" />
                </div>
                <div>
                  <label>Co-PI 1 Designation</label>
                  <input type="text" value={form.coPI1Designation} onChange={set("coPI1Designation")} placeholder="Designation" />
                </div>
                <div>
                  <label>Co-PI 1 Address</label>
                  <input type="text" value={form.coPI1Address} onChange={set("coPI1Address")} placeholder="Address" />
                </div>
              </div>

              {/* Co-PI 2 */}
              <p className="rp-sublabel rp-mt">Co-PI 2</p>
              <div className="rp-person-grid">
                <div>
                  <label>Co-PI 2 Name</label>
                  <input type="text" value={form.coPI2Name} onChange={set("coPI2Name")} placeholder="Name" />
                </div>
                <div>
                  <label>Co-PI 2 Designation</label>
                  <input type="text" value={form.coPI2Designation} onChange={set("coPI2Designation")} placeholder="Designation" />
                </div>
                <div>
                  <label>Co-PI 2 Address</label>
                  <input type="text" value={form.coPI2Address} onChange={set("coPI2Address")} placeholder="Address" />
                </div>
              </div>

              {/* Co-PI 3 */}
              <p className="rp-sublabel rp-mt">Co-PI 3</p>
              <div className="rp-person-grid">
                <div>
                  <label>Co-PI 3 Name</label>
                  <input type="text" value={form.coPI3Name} onChange={set("coPI3Name")} placeholder="Name" />
                </div>
                <div>
                  <label>Co-PI 3 Designation</label>
                  <input type="text" value={form.coPI3Designation} onChange={set("coPI3Designation")} placeholder="Designation" />
                </div>
                <div>
                  <label>Co-PI 3 Address</label>
                  <input type="text" value={form.coPI3Address} onChange={set("coPI3Address")} placeholder="Address" />
                </div>
              </div>

              <div className="rp-form-row rp-mt">
                <YNRadio name="externalCollaborators" val={form.externalCollaborators} onChange={set("externalCollaborators")} label="Any external collaborators involved in the project?" />
              </div>
              <div className="rp-form-row">
                <YNRadio name="moaSigned" val={form.moaSigned} onChange={set("moaSigned")} label="Any MOA/MOU signed?" />
              </div>

              <h3 className="rp-form-section-title" style={{ marginTop: 28 }}>B. Project Details</h3>
              <div className="rp-form-grid">
                <div>
                  <label>Project Sanction Reference No.</label>
                  <input type="text" value={form.sanctionRef} onChange={set("sanctionRef")} />
                </div>
                <div>
                  <label>Project Duration</label>
                  <input type="text" value={form.projectDuration} onChange={set("projectDuration")} placeholder="e.g. 3 years" />
                </div>
                <div>
                  <label>Budget Sanctioned (₹)</label>
                  <input type="text" value={form.budgetSanctioned} onChange={set("budgetSanctioned")} />
                </div>
              </div>

              {/* Budget Released — Date / Amount / CTDT Proc No, as on paper form */}
              <p className="rp-sublabel">Budget Released</p>
              <div className="rp-installment-grid">
                {[
                  ["I Instalment", "installment1Amount", "installment1Date", "installment1Ctdt"],
                  ["II Instalment", "installment2Amount", "installment2Date", "installment2Ctdt"],
                  ["III Instalment", "installment3Amount", "installment3Date", "installment3Ctdt"],
                ].map(([label, aKey, dKey, cKey]) => (
                  <div className="rp-instalment" key={label}>
                    <span className="rp-inst-label">{label}</span>
                    <label className="rp-inst-field-label">Date of release</label>
                    <input type="date" value={form[dKey]} onChange={set(dKey)} />
                    <label className="rp-inst-field-label">Amount (₹)</label>
                    <input type="text" placeholder="Amount (₹)" value={form[aKey]} onChange={set(aKey)} />
                    <label className="rp-inst-field-label">CTDT Proc No.</label>
                    <input type="text" placeholder="CTDT proc no" value={form[cKey]} onChange={set(cKey)} />
                  </div>
                ))}
              </div>

              <div className="rp-form-row rp-mt">
                <YNRadio name="majorEquipment" val={form.majorEquipment} onChange={set("majorEquipment")} label="Any major equipment purchased (costing more than ₹10 lakhs)?" />
              </div>
              {form.majorEquipment === "yes" && (
                <div className="rp-conditional">
                  <div className="rp-form-grid" style={{ marginBottom: 14 }}>
                    <div>
                      <label>Cost of Equipment</label>
                      <input type="text" value={form.equipmentCost} onChange={set("equipmentCost")} />
                    </div>
                  </div>
                  <p className="rp-sublabel" style={{ marginBottom: 8 }}>
                    Equipment entry details in department stock register
                    <span className="rp-hint"> (Enclose the copy of the stock register with this report)</span>
                  </p>
                  <div className="rp-form-grid">
                    <div>
                      <label>S.No.</label>
                      <input type="text" value={form.stockEntrySNo} onChange={set("stockEntrySNo")} />
                    </div>
                    <div>
                      <label>Pg.No.</label>
                      <input type="text" value={form.stockEntryPgNo} onChange={set("stockEntryPgNo")} />
                    </div>
                  </div>
                  <div className="rp-form-row" style={{ marginTop: 10 }}>
                    <YNRadio name="stockRegisterEnclose" val={form.stockRegisterEnclose} onChange={set("stockRegisterEnclose")} label="Stock register copy enclosed with this report?" />
                  </div>
                </div>
              )}

              <div className="rp-form-row rp-mt">
                <YNRadio name="extensionObtained" val={form.extensionObtained} onChange={set("extensionObtained")} label="Any extension obtained from funding agency?" />
              </div>
              {form.extensionObtained === "yes" && (
                <div className="rp-form-grid rp-conditional">
                  <div>
                    <label>Funding Agency for Extension</label>
                    <input type="text" value={form.extensionAgency} onChange={set("extensionAgency")} />
                  </div>
                </div>
              )}

              {/* Item 7 — Utilization Certificate (separate Yes/No) */}
              <div className="rp-form-row rp-mt">
                <YNRadio name="utilizationCertificate" val={form.utilizationCertificate} onChange={set("utilizationCertificate")} label="Utilization Certificate submitted?" />
              </div>

              {/* Item 8 — Percentage of Fund Utilization (kept distinct from item 7) */}
              <p className="rp-sublabel rp-mt">Percentage of Fund Utilization (based on the amount received)</p>
              <div className="rp-form-grid">
                {[["I Year", "utilizationI"], ["II Year", "utilizationII"], ["III Year", "utilizationIII"]].map(([lbl, k]) => (
                  <div key={k}>
                    <label>{lbl} (%)</label>
                    <input type="text" value={form[k]} onChange={set(k)} placeholder="e.g. 85%" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PAGE 2 ── */}
          {page === 2 && (
            <div>
              <h3 className="rp-form-section-title">Closure Details</h3>
              <table className="rp-detail-table">
                <tbody>
                  <tr>
                    <td className="rp-dtd">9. Any unspent money returned to the funding agency</td>
                    <td className="rp-dtd">
                      <YNRadio name="unspentReturned" val={form.unspentReturned} onChange={set("unspentReturned")} />
                    </td>
                    <td className="rp-dtd">
                      {form.unspentReturned === "yes" && (
                        <div className="rp-inline-fields">
                          <div>
                            <label>Amount</label>
                            <input type="text" value={form.unspentAmount} onChange={set("unspentAmount")} />
                          </div>
                          <div>
                            <label>Mode of Return</label>
                            <select value={form.unspentMode} onChange={set("unspentMode")}>
                              <option value="">Select</option>
                              <option value="DD">DD</option>
                              <option value="Bharatkosh">Bharatkosh</option>
                              <option value="Others">Others</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">10. Any audit objection received</td>
                    <td className="rp-dtd">
                      <YNRadio name="auditObjection" val={form.auditObjection} onChange={set("auditObjection")} />
                    </td>
                    <td className="rp-dtd"></td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">11. Whether the project closure report submitted to the funding agency</td>
                    <td className="rp-dtd">
                      <YNRadio name="completionReportSubmitted" val={form.completionReportSubmitted} onChange={set("completionReportSubmitted")} />
                    </td>
                    <td className="rp-dtd"></td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">12. Whether project closure certificate received from funding agency</td>
                    <td className="rp-dtd">
                      <YNRadio name="closureCertificateReceived" val={form.closureCertificateReceived} onChange={set("closureCertificateReceived")} />
                    </td>
                    <td className="rp-dtd"></td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">13. Outcome of the project</td>
                    <td className="rp-dtd" colSpan={2}>
                      <div className="rp-checkbox-row">
                        {[["outcomeProduct", "Product"], ["outcomePatent", "Patent"], ["outcomePublications", "Publications"], ["outcomePhD", "Ph.D"]].map(([k, lbl]) => (
                          <label key={k} className="rp-cb-label">
                            <input type="checkbox" checked={form[k]} onChange={set(k)} />
                            <span>{lbl}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">14. The TRL level of the Project outcome</td>
                    <td className="rp-dtd" colSpan={2}>
                      <div className="rp-radio-row">
                        {["TRL 1-3", "TRL 4-6", "TRL 7-9"].map((v) => (
                          <label key={v} className="rp-cb-label">
                            <input type="radio" name="trlLevel" value={v} checked={form.trlLevel === v} onChange={set("trlLevel")} />
                            <span>{v}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="rp-dtd">15. Whether the PI is interested in continuing the project to improve the TRL?</td>
                    <td className="rp-dtd" colSpan={2}>
                      <div className="rp-radio-row">
                        {["yes", "no", "na"].map((v) => (
                          <label key={v} className="rp-cb-label">
                            <input type="radio" name="piInterestedContinue" value={v} checked={form.piInterestedContinue === v} onChange={set("piInterestedContinue")} />
                            <span>{v === "na" ? "NA" : v.charAt(0).toUpperCase() + v.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="rp-certification-box">
                <p>It is certified that the project has been closed and the proposed objectives are met. The received fund has been utilized as per the Funding agency/Anna University norms. There is no unspent money left in the project. The project closure report and final UC have been submitted to the funding agency.</p>
              </div>

              <div className="rp-signature-grid">
                <div className="rp-sig-box">
                  <span>Name and Signature of PI</span>
                  <div className="rp-sig-line" />
                </div>
                <div className="rp-sig-box">
                  <span>Name and Signature of Co-PIs</span>
                  <div className="rp-sig-line" />
                </div>
              </div>
              <div className="rp-sig-center">
                <div className="rp-sig-box" style={{ maxWidth: 380 }}>
                  <span>Signature of the Director/HOD with seal and Date</span>
                  <div className="rp-sig-line" />
                </div>
              </div>
            </div>
          )}

          {/* ── PAGE 3 ── */}
          {page === 3 && (
            <div>
              <h3 className="rp-form-section-title">Checklist: Project Closure Report</h3>
              <p className="rp-checklist-hint">Mark Yes / No / NA for each item, and attach the matching file using its own Upload button.</p>
              <div className="rp-table-wrap rp-checklist-wrap">
                <table className="rp-checklist-table">
                  <thead>
                    <tr>
                      <th className="rp-chth rp-chth-no">S.No</th>
                      <th className="rp-chth rp-chth-doc">Documents Enclosed</th>
                      <th className="rp-chth rp-chth-yn">Yes</th>
                      <th className="rp-chth rp-chth-yn">No</th>
                      <th className="rp-chth rp-chth-yn">NA</th>
                      <th className="rp-chth rp-chth-upload-head">Upload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOC_CHECKLIST.map((d) => (
                      <CheckDocRow key={d.key} no={d.no} label={d.label} fKey={d.key} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rp-signature-grid rp-mt">
                <div className="rp-sig-box">
                  <span>Name and Signature of PI</span>
                  <div className="rp-sig-line" />
                </div>
                <div className="rp-sig-box">
                  <span>Name and Signature of Co-PIs</span>
                  <div className="rp-sig-line" />
                </div>
              </div>
              <div className="rp-office-use">
                <strong>Office Use</strong>
                <p>Verified the submitted documents</p>
                <div className="rp-office-sig-grid">
                  <span>Dealing hand</span>
                  <span>Superintendent</span>
                  <span>Director CSRC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="rp-modal-foot">
          <div>
            {page > 1 && (
              <button className="rp-btn-ghost" onClick={() => setPage(p => p - 1)}>← Back</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="rp-btn-ghost" onClick={downloadPDF} disabled={pdfBusy}>
              {pdfBusy ? "Generating…" : "Download PDF"}
            </button>
            {page < 3 ? (
              <button className="rp-btn-primary" onClick={() => setPage(p => p + 1)}>Next →</button>
            ) : (
              <button className="rp-btn-green" onClick={handleSubmit}>Submit for Review</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Hidden, but fully laid-out, printable PDF source ───────────────
          Kept at full A4-ish width with normal visibility (not display:none)
          so html2canvas can actually rasterize it; only pushed off-screen
          via position+left so it never appears in the UI. */}
      <div
        id={`closure-pdf-content-${project.id}`}
        className="rp-pdf-source"
      >
        <div className="rp-pdf-header">
          <strong className="rp-pdf-org">CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</strong>
          <strong className="rp-pdf-univ">ANNA UNIVERSITY</strong>
          <strong className="rp-pdf-doctitle">PROJECT COMPLETION REPORT</strong>
          <em className="rp-pdf-note">[To be submitted to CSRC after completion of Each funded project]</em>
        </div>

        {/* A. Investigators Details — table layout mirroring the paper form */}
        <table className="rp-pdf-table">
          <tbody>
            <tr><td className="rp-pdf-section" colSpan={2}>A Investigators Details</td></tr>
            <tr><td className="rp-pdf-key">1. Project Title</td><td className="rp-pdf-val">{form.projectTitle}</td></tr>
            <tr><td className="rp-pdf-key">2. Funding Agency</td><td className="rp-pdf-val">{form.fundingAgency}</td></tr>
            <tr><td className="rp-pdf-key">3. National /International</td><td className="rp-pdf-val">{form.national === "international" ? "International" : "National"}</td></tr>
            <tr>
              <td className="rp-pdf-key">4. Principal Investigator<br />Designation and address</td>
              <td className="rp-pdf-val">
                {form.piName}{form.piDesignation ? `, ${form.piDesignation}` : ""}{form.piAddress ? `, ${form.piAddress}` : ""}
              </td>
            </tr>
            <tr>
              <td className="rp-pdf-key">5. Co-Principal Investigator(s)<br />Designation and address</td>
              <td className="rp-pdf-val">
                Co-PI 1: {form.coPI1Name}{form.coPI1Designation ? `, ${form.coPI1Designation}` : ""}{form.coPI1Address ? `, ${form.coPI1Address}` : ""}<br />
                Co-PI 2: {form.coPI2Name}{form.coPI2Designation ? `, ${form.coPI2Designation}` : ""}{form.coPI2Address ? `, ${form.coPI2Address}` : ""}<br />
                Co-PI 3: {form.coPI3Name}{form.coPI3Designation ? `, ${form.coPI3Designation}` : ""}{form.coPI3Address ? `, ${form.coPI3Address}` : ""}
              </td>
            </tr>
            <tr><td className="rp-pdf-key">6. Any external collaborators involved in the project</td><td className="rp-pdf-val">{form.externalCollaborators === "yes" ? "Yes" : "No"}</td></tr>
            <tr><td className="rp-pdf-key">7. Any MOA/MOU signed</td><td className="rp-pdf-val">{form.moaSigned === "yes" ? "Yes" : "No"}</td></tr>
          </tbody>
        </table>

        {/* B. Project Details */}
        <table className="rp-pdf-table rp-mt-table">
          <tbody>
            <tr><td className="rp-pdf-section" colSpan={2}>B Project Details</td></tr>
            <tr><td className="rp-pdf-key">1. Project sanction reference no</td><td className="rp-pdf-val">{form.sanctionRef}</td></tr>
            <tr><td className="rp-pdf-key">2. Project Duration</td><td className="rp-pdf-val">{form.projectDuration}</td></tr>
            <tr><td className="rp-pdf-key">3. Budget Sanctioned</td><td className="rp-pdf-val">₹{form.budgetSanctioned}</td></tr>
            <tr>
              <td className="rp-pdf-key">4. Budget Released</td>
              <td className="rp-pdf-val">
                <table className="rp-pdf-subtable">
                  <thead>
                    <tr>
                      <th>Instalment</th><th>Date of release</th><th>Amount</th><th>CTDT proc no</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>I</td><td>{form.installment1Date}</td><td>{form.installment1Amount}</td><td>{form.installment1Ctdt}</td></tr>
                    <tr><td>II</td><td>{form.installment2Date}</td><td>{form.installment2Amount}</td><td>{form.installment2Ctdt}</td></tr>
                    <tr><td>III</td><td>{form.installment3Date}</td><td>{form.installment3Amount}</td><td>{form.installment3Ctdt}</td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="rp-pdf-key">5. Any major Equipment purchased (costing more than 10 lakhs)</td>
              <td className="rp-pdf-val">
                {form.majorEquipment === "yes" ? "Yes" : "No"}
                {form.majorEquipment === "yes" && (
                  <>
                    <br />Cost of the Equipment: {form.equipmentCost}
                    <br />Equipment entry details in department stock register (Enclose the copy of the stock register with this report):
                    <br />S.No: {form.stockEntrySNo} &nbsp;&nbsp; Pg.No: {form.stockEntryPgNo}
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td className="rp-pdf-key">6. Any Extension obtained from funding agency</td>
              <td className="rp-pdf-val">{form.extensionObtained === "yes" ? `Yes — ${form.extensionAgency}` : "No"}</td>
            </tr>
            <tr><td className="rp-pdf-key">7. Utilization Certificate</td><td className="rp-pdf-val">{form.utilizationCertificate === "yes" ? "Yes" : "No"}</td></tr>
            <tr>
              <td className="rp-pdf-key">8. Percentage of Fund Utilization (based on the amount received)</td>
              <td className="rp-pdf-val">
                I year: {form.utilizationI || "—"} &nbsp;&nbsp; II Year: {form.utilizationII || "—"} &nbsp;&nbsp; III Year: {form.utilizationIII || "—"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Closure details 9–15 */}
        <table className="rp-pdf-table rp-mt-table">
          <tbody>
            <tr>
              <td className="rp-pdf-key">9. Any unspent money returned to the funding agency</td>
              <td className="rp-pdf-val">
                {form.unspentReturned === "yes"
                  ? `Yes — Amount: ${form.unspentAmount || "—"}, Mode of return: ${form.unspentMode || "—"}`
                  : "No"}
              </td>
            </tr>
            <tr><td className="rp-pdf-key">10. Any audit objection received</td><td className="rp-pdf-val">{form.auditObjection === "yes" ? "Yes" : "No"}</td></tr>
            <tr><td className="rp-pdf-key">11. Whether the project completion report submitted to the funding agency</td><td className="rp-pdf-val">{form.completionReportSubmitted === "yes" ? "Yes" : "No"}</td></tr>
            <tr><td className="rp-pdf-key">12. Whether project closure certificate received from funding agency</td><td className="rp-pdf-val">{form.closureCertificateReceived === "yes" ? "Yes" : "No"}</td></tr>
            <tr>
              <td className="rp-pdf-key">13. Outcome of the project</td>
              <td className="rp-pdf-val">
                {[
                  form.outcomeProduct && "Product",
                  form.outcomePatent && "Patent",
                  form.outcomePublications && "Publications",
                  form.outcomePhD && "Ph.D",
                ].filter(Boolean).join(", ") || "—"}
              </td>
            </tr>
            <tr><td className="rp-pdf-key">14. The TRL level of the Project outcome</td><td className="rp-pdf-val">{form.trlLevel || "—"}</td></tr>
            <tr>
              <td className="rp-pdf-key">15. Whether the PI is interested in continuing the project to improve the TRL?</td>
              <td className="rp-pdf-val">{form.piInterestedContinue === "na" ? "NA" : form.piInterestedContinue === "yes" ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>

        <p className="rp-pdf-certify">
          It is certified that the project has been completed and the proposed objective are met. The received
          fund has been utilized as per the Funding agency/Anna University norms. There is no unspent money
          left in the project. The project completion report and final UC have been submitted to the funding
          agency.
        </p>

        <div className="rp-pdf-sig-row">
          <div className="rp-pdf-sig-box">Name and Signature of PI</div>
          <div className="rp-pdf-sig-box">Name and Signature of Co-PIs</div>
        </div>
        <div className="rp-pdf-sig-center">
          <div className="rp-pdf-sig-box">Signature of the Director/HOD of the PI with seal and Date</div>
        </div>

        <div className="rp-pdf-office">
          <strong>Office Use</strong>
          <p>Verified the submitted documents &nbsp;&nbsp; REMARKS: ……………………………………</p>
          <div className="rp-pdf-office-row">
            <span>Dealing hand</span>
            <span>Superintendent</span>
            <span>Director CSRC</span>
          </div>
        </div>

        {/* Checklist page — own page in the PDF */}
        <div className="rp-pdf-pagebreak" />
        <div className="rp-pdf-header rp-pdf-header-2">
          <strong className="rp-pdf-org">CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</strong>
          <strong className="rp-pdf-univ">ANNA UNIVERSITY</strong>
          <strong className="rp-pdf-doctitle">CHECKLIST:: PROJECT COMPLETION REPORT</strong>
        </div>
        <table className="rp-pdf-table">
          <tbody>
            <tr><td className="rp-pdf-key">1. Project Title</td><td className="rp-pdf-val">{form.projectTitle}</td></tr>
            <tr><td className="rp-pdf-key">2. Funding Agency</td><td className="rp-pdf-val">{form.fundingAgency}</td></tr>
            <tr>
              <td className="rp-pdf-key">4. Principal Investigators</td>
              <td className="rp-pdf-val">
                PI: {form.piName}<br />
                Co-PI 1: {form.coPI1Name}<br />
                Co-PI 2: {form.coPI2Name}<br />
                Co-PI 3: {form.coPI3Name}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="rp-pdf-checklist">
          <thead>
            <tr>
              <th>S No</th><th>Documents Enclosed</th><th>Yes</th><th>No</th><th>NA</th><th>Files attached</th>
            </tr>
          </thead>
          <tbody>
            {DOC_CHECKLIST.map((d) => (
              <tr key={d.key}>
                <td>{d.no}</td>
                <td className="rp-pdf-doclabel">{d.label}</td>
                <td className="rp-pdf-center">{form[d.key] === "yes" ? "✓" : ""}</td>
                <td className="rp-pdf-center">{form[d.key] === "no" ? "✓" : ""}</td>
                <td className="rp-pdf-center">{form[d.key] === "na" ? "✓" : ""}</td>
                <td className="rp-pdf-files">{(form.uploadsByDoc[d.key] || []).join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rp-pdf-sig-row rp-mt-table">
          <div className="rp-pdf-sig-box">Name and Signature of PI</div>
          <div className="rp-pdf-sig-box">Name and Signature of Co-PIs</div>
        </div>
        <div className="rp-pdf-office">
          <strong>Office Use</strong>
          <p>Verified the submitted documents</p>
          <div className="rp-pdf-office-row">
            <span>Dealing hand</span>
            <span>Superintendent</span>
            <span>Director CSRC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function Reports() {
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [detailProject, setDetailProject] = useState(null);
  const [closureProject, setClosureProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: "", funding: "", scheme: "", agencyType: "", faculty: "", department: "", campus: "",
    sanctionFrom: "", sanctionTo: "", endFrom: "", endTo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const counts = {
    ongoing: projects.filter(p => p.status === "ongoing").length,
    completed: projects.filter(p => p.status === "completed" || (p.closureStatus === "under_review")).length,
    closed: projects.filter(p => p.status === "closed").length,
  };

  const tabProjects = projects.filter((p) => {
    if (activeTab === "ongoing") return p.status === "ongoing";
    if (activeTab === "completed") return p.status === "completed" || p.closureStatus === "under_review";
    if (activeTab === "closed") return p.status === "closed";
    return false;
  }).filter((p) => {
    const f = appliedFilters;
    if (f.q && !p.title.toLowerCase().includes(f.q.toLowerCase()) && !p.fileNo.toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.campus && !p.campus.includes(f.campus)) return false;
    if (f.department && !p.department.includes(f.department)) return false;
    return true;
  });

  const handleSearch = () => setAppliedFilters(filters);
  const handleReset = () => { const e = { q: "", funding: "", scheme: "", agencyType: "", faculty: "", department: "", campus: "", sanctionFrom: "", sanctionTo: "", endFrom: "", endTo: "" }; setFilters(e); setAppliedFilters(e); };

  const handleSubmitClosure = (p) => { setDetailProject(null); setClosureProject(p); };

  const handleClosureSubmit = (id, formData) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, closureSubmitted: true, closureData: formData, closureStatus: "under_review" } : p));
    setClosureProject(null);
  };

  const handleApproveClosure = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "closed", closureStatus: "approved" } : p));
    setDetailProject(null);
  };

  const tabs = [
    { key: "ongoing", label: "Ongoing Projects", icon: "🔵" },
    { key: "completed", label: "Completed Projects", icon: "🟡" },
    { key: "closed", label: "Closed Projects", icon: "🟢" },
  ];

  return (
    <div className="rp-page">
      {/* Page header */}
      <div className="rp-page-header">
        <div>
          <h1 className="rp-page-title">Project Reports</h1>
          <p className="rp-page-sub">CSRC — Centre for Sponsored Research and Consultancy, Anna University</p>
        </div>
        <button className="rp-btn-ghost" onClick={() => setShowFilters(v => !v)}>
          {showFilters ? "Hide Filters ↑" : "Show Filters ↓"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="rp-summary-cards">
        {tabs.map(({ key, label, icon }) => (
          <div
            key={key}
            className={`rp-summary-card ${activeTab === key ? "rp-summary-active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <span className="rp-summary-icon">{icon}</span>
            <div>
              <div className="rp-summary-count">{counts[key]}</div>
              <div className="rp-summary-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}

      {/* Tab content */}
      <div className="rp-content-panel">
        <div className="rp-tab-header">
          <div>
            <h2 className="rp-sec-title">
              {tabs.find(t => t.key === activeTab)?.label}
            </h2>
            <p className="rp-sec-sub">{tabProjects.length} project{tabProjects.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {tabProjects.length === 0 ? (
          <div className="rp-empty">
            <p>No projects found. Adjust filters or check back later.</p>
          </div>
        ) : (
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th className="rp-th">File No.</th>
                  <th className="rp-th">Project Title</th>
                  <th className="rp-th">Principal Investigator</th>
                  <th className="rp-th">Department</th>
                  <th className="rp-th">Campus</th>
                  <th className="rp-th rp-th-center">Status</th>
                  {activeTab === "completed" && <th className="rp-th rp-th-center">Action</th>}
                </tr>
              </thead>
              <tbody>
                {tabProjects.map((p) => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    onClick={setDetailProject}
                    onSubmitClosure={handleSubmitClosure}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project detail drawer */}
      {detailProject && (
        <ProjectDrawer
          project={detailProject}
          onClose={() => setDetailProject(null)}
          onSubmitClosure={handleSubmitClosure}
          onApproveClosure={handleApproveClosure}
        />
      )}

      {/* Closure form modal */}
      {closureProject && (
        <ClosureForm
          project={closureProject}
          onClose={() => setClosureProject(null)}
          onSubmit={handleClosureSubmit}
        />
      )}
    </div>
  );
}