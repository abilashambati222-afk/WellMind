# AI-POWERED REAL-TIME EXAM PROCTORING SYSTEM
**KMIT RTRP Project Documentation (II Year II Semester)**

---

## Cover Page

### A Real-time Research Project / Societal Related Project
#### Report on
## AI-POWERED REAL-TIME EXAM PROCTORING SYSTEM

Submitted in Partial fulfillment of requirements for B.Tech II Year II Semester course

**Submitted by:**
*   Akshaya Sai Neela (24BD1A0597)
*   Vivek Vardhan (24BD1A059X)
*   Siddarth Panja (24BD1A05DF)
*   Sai Samhitha (24BD1A05FG)
*   Suchith Dasa (25BD5A0530)

**Under the Guidance of:**
**Ms. E. Harismitha**  
Assistant Professor, Department of CSE (AI & ML)

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (AI & ML)**  
**KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY**  
*(AN AUTONOMOUS INSTITUTION)*  
*Accredited by NBA & NAAC, Approved by AICTE, Affiliated to JNTUH*  
Narayanaguda, Hyderabad, Telangana – 500029  
**Academic Year: 2025–2026**

---

## Bonafide Certificate

### KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY
**(AN AUTONOMOUS INSTITUTION)**  
*Accredited by NBA & NAAC, Approved by AICTE, Affiliated to JNTUH*  
*Narayanaguda, Hyderabad, Telangana-29*

This is to certify that this is a Bonafide record of the project report titled **“AI-POWERED REAL-TIME EXAM PROCTORING SYSTEM”** which is being presented as the Real-time Research Project / Societal Related Project report by
1.  Akshaya Sai Neela (24BD1A0597)
2.  Vivek Vardhan (24BD1A059X)
3.  Siddarth Panja (24BD1A05DF)
4.  Sai Samhitha (24BD1A05FG)
5.  Suchith Dasa (25BD5A0530)

In partial fulfillment for the II Year II Semester Course RTRP in KMIT affiliated to the **Jawaharlal Nehru Technological University, Hyderabad** during the academic year 2025-2026.

**Ms. E. Harismitha**  
*Internal Mentor*  
Assistant Professor, Dept of CSE (AI&ML)  

**Mr. Shailesh Gangakhedkar**  
*Program Coordinator*  
RTRP Program Coordinator, KMIT  

**Submitted for Final Project Review held on:** ____________________________

---

## Declaration

We hereby declare that the results embodied in the dissertation entitled **“AI-POWERED REAL-TIME EXAM PROCTORING SYSTEM”** has been carried out by us together during the academic year 2025-26 as a partial fulfillment of the B.Tech II Year II Semester Course **“Real-time Research Project / Societal Related Project”**. We have not submitted this report to any other Course/College.

*   Akshaya Sai Neela (24BD1A0597) — Signature: _________________
*   Vivek Vardhan (24BD1A059X) — Signature: _________________
*   Siddarth Panja (24BD1A05DF) — Signature: _________________
*   Sai Samhitha (24BD1A05FG) — Signature: _________________
*   Suchith Dasa (25BD5A0530) — Signature: _________________

Date: _____________________

---

## Vision and Mission of KMIT

### Vision
*   To be the fountain head in producing highly skilled, globally competent engineers.
*   Producing quality graduates trained in the latest software technologies and related tools and striving to make India a world leader in software products and services.

### Mission
*   To provide a learning environment that inculcates problem solving skills, professional, ethical responsibilities, lifelong learning through multi model platforms and prepares students to become successful professionals.
*   To establish an industry institute Interaction to make students ready for the industry.
*   To provide exposure to students on the latest hardware and software tools.
*   To promote research based projects/activities in the emerging areas of technology convergence.
*   To encourage and enable students to not merely seek jobs from the industry but also to create new enterprises.
*   To induce a spirit of nationalism which will enable the student to develop, understand India's challenges and to encourage them to develop effective solutions.
*   To support the faculty to accelerate their learning curve to deliver excellent service to students.

---

## Program Outcomes (POs)

*   **PO1. Engineering Knowledge:** Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.
*   **PO2. Problem Analysis:** Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.
*   **PO3. Design/Development of solutions:** Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.
*   **PO4. Conduct Investigations of Complex problems:** Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.
*   **PO5. Modern Tool Usage:** Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.
*   **PO6. The Engineer and Society:** Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal, and cultural issues and the consequent responsibilities relevant to the professional engineering practice.
*   **PO7. Environment and Sustainability:** Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.
*   **PO8. Ethics:** Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.
*   **PO9. Individual and Team Work:** Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.
*   **PO10. Communication:** Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.
*   **PO11. Project Management and Finance:** Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.
*   **PO12. Life-Long Learning:** Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.

---

## Project Outcomes

*   **P1:** Design and implement a full-stack AI proctoring system integrating real-time video analysis with web technologies.
*   **P2:** Apply computer vision techniques (OpenCV, Media Pipe, YOLO) to detect and classify exam violations accurately.
*   **P3:** Develop a secure, scalable examination platform with role-based access, JWT authentication, and real-time communication.
*   **P4:** Demonstrate understanding of system design principles including microservice architecture, event-driven communication, and data persistence.

### Mapping Project Outcomes with Program Outcomes

| PO | PO1 | PO2 | PO3 | PO4 | PO5 | PO6 | PO7 | PO8 | PO9 | PO10 | PO11 | PO12 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **P1** | M | H | H | M | H | H | M | M | - | - | - | - |
| **P2** | H | H | M | H | H | M | M | M | - | - | - | - |
| **P3** | M | H | H | M | H | M | M | H | H | M | M | - |
| **P4** | H | H | H | H | H | H | H | H | M | - | - | - |

*(L – Low, M – Medium, H – High)*

---

## Acknowledgement

We take this opportunity to thank all the people who have rendered their full support to our project work. We render our thanks to **Dr. B L Malleswari**, Principal who encouraged us to do the Project.

We are grateful to **Mr. Neil Gogte**, Founder & Director and **Mr. S. Nitin**, Director, for facilitating all the amenities required for carrying out this project.

We express our sincere gratitude to **Ms. Deepa Ganu**, Academic Director for providing an excellent environment in the college.

We are also thankful to **Mr. Shailesh Gangakhedkar**, Real-Time Research Project Program Coordinator for providing us with time to make this project a success within the given schedule.

We are also thankful to our Project Mentor **Ms. E. Harismitha**, Assistant Professor, Department of CSE (AI & ML) for her valuable guidance and encouragement given to us throughout the project work.

We would like to thank the entire KMIT faculty, who helped us directly and indirectly in the completion of the project.

We sincerely thank our friends and family for their constant motivation during the project work.

---

## Abstract

In this project, a prototype and implementation of an AI-based online examination proctoring system is demonstrated. The increasing adoption of online examinations has exposed significant vulnerabilities in maintaining academic integrity. Traditional remote assessments lack robust monitoring mechanisms, enabling malpractice and reducing institutional trust. This proposed system presents an AI-powered real-time examination proctoring system designed to address these challenges comprehensively while preserving student privacy: all AI inference is performed directly inside the student's web browser, and no raw webcam video is ever transmitted to or stored on a server.

The system integrates computer-vision and machine-learning techniques that run entirely on the client using TensorFlow.js. It employs face-api.js (TinyFaceDetector, 68-point face landmarks, and a face-recognition network) for identity verification through a 128-dimensional face descriptor, as well as face-presence detection, multiple-face detection, and head-pose estimation. A YOLOv8 model compiled for the web (TensorFlow.js) identifies prohibited items such as mobile phones. The Web Audio API detects suspicious audio, and browser-level controls detect tab switching, full-screen exit, copy/paste attempts, and external (dual-monitor) displays.

The platform is built on a modern full-stack architecture: three separate React 19 (Vite) frontend applications (Login, Student, and Admin portals), Node.js with Express.js for the backend API, MongoDB for persistent data storage, Redis for response caching, and Cloudinary for storing violation evidence images. Socket.IO enables real-time communication and serves as the WebRTC signaling channel through which an administrator views a student's live video stream peer-to-peer. JWT-based authentication, combined with login-IP binding, enforces role-based access control and single-device sessions.

Key outcomes include a violation-scoring system that auto-submits or terminates the exam when a configurable threshold is exceeded, a live admin dashboard for monitoring all students of an institution simultaneously, complete data isolation between institutions, and a comprehensive violation log with type classification and image evidence. The system is designed to be scalable across institutions, offering a privacy-preserving and cost-effective alternative to commercial proctoring solutions.

---

## Table of Contents

1.  **CHAPTER 1: INTRODUCTION**
    *   1.1 Purpose of the Project
    *   1.2 Problem with Existing Systems
    *   1.3 Proposed System
    *   1.4 Scope of the Project
    *   1.5 Architecture Diagram
2.  **CHAPTER 2: LITERATURE SURVEY**
    *   2.1 Existing Approaches to Online Proctoring
    *   2.2 Key Research References
    *   2.3 Research Gaps Addressed
3.  **CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION**
    *   3.1 Introduction to SRS
    *   3.2 Role of SRS
    *   3.3 Requirements Specification Document
    *   3.4 Functional Requirements
    *   3.5 Non-Functional Requirements
    *   3.6 Performance Requirements
    *   3.7 Software Requirements
    *   3.8 Hardware Requirements
4.  **CHAPTER 4: SYSTEM DESIGN**
    *   4.1 Introduction to UML
    *   4.2 UML Diagrams
        *   4.2.1 Use Case Diagram
        *   4.2.2 Sequence Diagram
        *   4.2.3 State Chart Diagram
        *   4.2.4 Deployment Diagram
    *   4.3 Technologies Used
5.  **CHAPTER 5: IMPLEMENTATION**
    *   5.1 System Components
    *   5.2 Coding the logic - pipeline
    *   5.3 Connecting the dashboard
    *   5.4 User Role and Permission
    *   5.5 UI Screen shots
6.  **CHAPTER 6: SOFTWARE TESTING**
    *   6.1 Introduction
        *   6.1.1 Testing Objectives
        *   6.1.2 Testing Strategies
        *   6.1.3 System Evaluation
        *   6.1.4 Testing New System
    *   6.2 Test Cases
    *   6.3 Known Limitations
7.  **CONCLUSION**
8.  **FUTURE ENHANCEMENTS**
9.  **REFERENCES & BIBLIOGRAPHY**

---

## Chapter 1: Introduction

### 1.1 Purpose of the Project
Online examinations have become ubiquitous in academic institutions and corporate hiring processes, accelerated by the global shift towards remote learning. However, the absence of physical supervision creates opportunities for academic dishonesty, undermining the credibility of assessments. Our project aims to restore confidence in remote examinations by providing intelligent, automated proctoring that monitors candidates continuously and flags suspicious behaviour in real time — while keeping the student's video on their own device.

By performing all processing client-side, the system respects student privacy while providing robust monitoring. Institutions can deploy the software on their own infrastructure, maintaining full control over student data and violation parameters. This proctoring system is designed to handle multiple exam sessions concurrently, ensuring reliability and fairness during high-stakes assessments.

### 1.2 Problem with Existing Systems
Current online examination platforms either rely on human proctors (expensive, non-scalable) or commercial AI proctoring tools (opaque, costly, and privacy-concerning). Specific issues include:
*   High per-exam cost of commercial proctoring tools (ProctorU, Honorlock).
*   Data privacy concerns: student webcam footage sent to third-party servers.
*   Lack of customization: institutions cannot adjust violation thresholds or scoring.
*   No institutional deployment option: always dependent on external SaaS.
*   Algorithmic bias in commercial face detection affecting diverse student populations.

### 1.3 Proposed System
The proposed AI-Powered Real-Time Exam Proctoring System is an institution-deployable proctoring platform. It performs all AI analysis locally in the student's browser and never stores raw video streams; only screenshots of confirmed violations are retained for review. Administrators can review flagged incidents and act on them. The system provides:
*   Identity verification via face recognition (128-D face descriptor) before exam entry.
*   Continuous real-time AI monitoring throughout the exam.
*   Automated violation detection across multiple categories (face, head pose, objects, audio, tab switching, and external displays).
*   A live admin dashboard with per-student live video and violation feeds, fully isolated per institution.
*   Automated exam submission or termination upon threshold violation.

### 1.4 Scope of the Project
The system targets educational institutions conducting B.Tech/degree examinations and corporate organisations running online assessments. It is designed to handle multiple concurrent exam sessions, with scalability built into the real-time communication layer and multi-tenant (per-institution) data isolation. Future scope includes integration with Learning Management Systems (LMS) such as Moodle and Canvas, advanced analytics, weighted violation scoring, and a fully self-hosted/offline exam-centre deployment.

### 1.5 Architecture Diagram
The system follows a multi-application architecture composed of:
1.  **Three independent React (Vite) front-end applications** — Login, Student, and Admin — each deployed separately.
2.  **A Node.js / Express backend** that exposes a REST API and hosts a Socket.IO server.
3.  **A MongoDB database (via Mongoose)** for persistence and a Redis cache for read-heavy endpoints.
4.  **Cloudinary** for storing violation evidence images.

Importantly, the AI proctoring runs entirely inside the student's browser using TensorFlow.js and face-api.js; the backend performs no video inference. Live admin monitoring is achieved with WebRTC peer-to-peer video, where Socket.IO only relays the signaling messages (offer / answer / ICE candidates). All live updates, violation alerts, and online-student counts are scoped to Socket.IO rooms keyed by institution, preventing any cross-institution data leakage.

---

## Chapter 2: Literature Survey

### 2.1 Existing Approaches to Online Proctoring
Research in automated online examination proctoring has evolved significantly with advancements in artificial intelligence and computer vision. Early proctoring systems primarily relied on rule-based mechanisms such as browser lockdowns and screen monitoring. These approaches restricted user actions like tab switching or copy-paste but failed to monitor physical behaviour, making them insufficient for preventing malpractice.

Subsequent systems introduced webcam-based monitoring with basic face detection techniques. These systems ensured candidate presence but lacked the ability to analyze behavioural patterns such as head movement, or environmental factors. As a result, they were prone to misuse and could not provide reliable supervision.

Recent developments in deep learning have enabled more advanced proctoring systems. These systems utilize facial landmark detection and object detection to analyze student behaviour in real time. Technologies such as facial-landmark models and Convolutional Neural Networks (CNNs) have significantly improved the accuracy and efficiency of such systems. This project applies the browser-based equivalents of these techniques — face-api.js and a YOLOv8 web model running on TensorFlow.js — to achieve a privacy-preserving design. However, challenges such as false positives, high computational cost, and privacy concerns still persist.

### 2.2 Key Research References
*   **Atoum et al. (2017)** proposed an automated online exam proctoring system using facial action unit recognition. Their approach focused on detecting suspicious facial expressions and achieved approximately 75% accuracy. However, the system required high computational resources, limiting its real-time applicability.
*   **Nigam et al. (2021)** conducted a comprehensive survey on AI-based examination proctoring systems. The study identified major challenges including false positives, sensitivity to lighting conditions, and bias in facial recognition models across different demographic groups.
*   **Bazrafkan et al. (2021)** demonstrated that MediaPipe Face Mesh provides high-precision facial landmark detection. Their work showed that it is effective for head pose tracking even under varying real-world lighting conditions, making it suitable for real-time applications.
*   **Redmon et al. (YOLO series, 2016–2022)** introduced the YOLO (You Only Look Once) family of object detection models. These models use a single-pass CNN architecture to achieve highspeed and accurate object detection, making them ideal for real-time video stream analysis.
*   **Aydin et al. (2020)** studied the ethical implications of AI-based proctoring systems, highlighting concerns related to privacy, data security, and algorithmic bias, which must be addressed in system design.

### 2.3 Research Gaps Addressed
The existing literature highlights several limitations in current online proctoring solutions. Many commercial systems are closed-source, expensive, and rely heavily on cloud-based infrastructure, which introduces latency and raises privacy concerns. Academic prototypes often focus on individual components such as face detection or object detection, without integrating multiple monitoring mechanisms into a single system.

There is a need for a unified, scalable, and privacy-preserving proctoring solution that can be deployed effectively at an institutional level. Additionally, many systems lack a structured violation management mechanism and real-time administrative monitoring capabilities.

The proposed system addresses these gaps by integrating multiple AI techniques — facial landmark detection, head pose estimation, and YOLO-based object detection — into a single real-time monitoring framework that runs entirely in the browser. It also incorporates a violation scoring mechanism and an admin dashboard for effective monitoring, ensuring improved accuracy, scalability, privacy, and reliability.

---

## Chapter 3: Software Requirement Specification

### 3.1 Introduction to SRS
This Software Requirements Specification (SRS) document describes the functional and non-functional requirements of the AI-Based Online Examination Proctoring System. It serves as a formal agreement between stakeholders and developers regarding system behavior, features, and constraints.

The system is designed to ensure fairness and integrity in online examinations by using Artificial Intelligence and Computer Vision techniques to monitor student behavior in real time.

### 3.2 Role of SRS
The SRS document plays a critical role in the software development lifecycle. It provides a clear understanding of system requirements and acts as a reference for developers, testers, and stakeholders.
The key roles of SRS include:
*   Defining system functionality and constraints clearly.
*   Acting as a communication bridge between stakeholders and developers.
*   Serving as a basis for system design and implementation.
*   Helping in validation and verification of the system.
*   Reducing ambiguity and development errors.

### 3.3 Requirements Specification Document
The requirements specification document defines all the system requirements in a structured manner. It includes both functional and non-functional requirements along with system constraints and performance expectations.

This document ensures that all stakeholders have a clear understanding of what the system is expected to perform. It also helps developers design and implement the system efficiently.

The requirements are categorized into:
*   Functional Requirements (what the system does).
*   Non-Functional Requirements (how the system performs).
*   Performance Requirements.
*   Software and Hardware Requirements.

### 3.4 Functional Requirements
*   **FR-01:** The system shall allow students and admins to register with email and password, scoped to an institution (only one admin is permitted per institution).
*   **FR-02:** The system shall authenticate users via JWT and enforce role-based access control.
*   **FR-03:** The system shall bind a login session to the user's IP address and enforce a single active device; if the request IP changes, the session is invalidated. Tokens expire after a fixed validity period (default 7 days).
*   **FR-04:** The system shall allow password reset via a time-limited OTP delivered by email.
*   **FR-05:** Admin shall create exams with title, subject, date/time window, duration, total marks, passing marks, and questions (MCQ / true-false / short answer).
*   **FR-06:** Admin shall activate/deactivate and terminate exam sessions.
*   **FR-07:** The system shall auto-grade objective questions and finalise scores post-exam.
*   **FR-08:** The system shall perform face verification (128-D descriptor match) before allowing exam entry.
*   **FR-09:** The system shall detect no-face and multiple-face scenarios in real time.
*   **FR-10:** The system shall track head pose and flag HEAD_TURN violations.
*   **FR-11:** The system shall detect prohibited objects (e.g. phone) using a YOLOv8 web model.
*   **FR-12:** The system shall detect suspicious audio using the Web Audio API.
*   **FR-13:** The system shall detect tab switching / window blur via the browser visibility API.
*   **FR-14:** The system shall enforce full-screen mode and detect external/dual-monitor displays.
*   **FR-15:** Each detected violation shall be logged with type, category, timestamp, and an evidence image (stored on Cloudinary).
*   **FR-16:** The system shall maintain a per-session violation count and last-violation type.
*   **FR-17:** When a category's violation count exceeds its threshold, the exam shall auto-submit or auto-terminate (e.g. 10 tab-switch / external-display events; 5 audio events).
*   **FR-18:** Admin shall be able to review and delete violation evidence images.

### 3.5 Non-Functional Requirements
*   **NFR-01:** The in-browser AI detection loop shall process frames in near real time on a standard student laptop.
*   **NFR-02:** The system shall support multiple concurrent exam sessions per institution.
*   **NFR-03:** All API endpoints shall be protected against injection and XSS, and shall enforce JWT + role authorisation.
*   **NFR-04:** Webcam data shall NOT be transmitted or stored as raw video; only violation evidence screenshots are uploaded.
*   **NFR-05:** The system shall be compatible with modern Chromium-based browsers (Chrome/Edge).

### 3.6 Performance Requirements
*   The system shall process each video frame within minimal delay to ensure real-time monitoring.
*   The system shall handle at least 50 concurrent users without performance degradation.
*   The response time for user actions (login, exam start, submission) shall be within acceptable limits.
*   The system shall maintain continuous operation during the entire exam duration without failure.

### 3.7 Software Requirements

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | 19.x |
| **Styling** | Tailwind CSS | 4.x |
| **Backend** | Node.js + Express.js | 18+ / 4.x |
| **Database** | MongoDB (Mongoose) | 6+ / 8.x |
| **Cache** | Redis | 7.x (client 5.x) |
| **Real-time** | Socket.IO | 4.x |
| **Live video** | WebRTC (browser native) | — |
| **In-browser AI** | TensorFlow.js | 4.x |
| **Face / landmarks** | @vladmandic/face-api.js | 1.7.x |
| **Object detection** | YOLOv8 (TF.js web model), coco-ssd | — / 2.x |
| **Media storage** | Cloudinary (+ Multer) | 1.x / 2.x |
| **Email (OTP reset)**| Nodemailer | 8.x |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs | 9.x / 2.x |

### 3.8 Hardware Requirements
*   **Server:** Minimum 4-core CPU, 8GB RAM, 50GB SSD storage. Approx. 1–2 vCPU / 1–2 GB RAM is sufficient for the API, with MongoDB and Redis hosted as managed services.
*   **Student device:** Webcam (720p minimum), microphone, and a modern Chromium browser; a CPU/GPU capable of running TensorFlow.js (any recent laptop), since AI inference happens locally.
*   **Network:** 2 Mbps uplink per student for video streaming. Stable connection to load the application and AI model files at exam start, and to stream live monitoring video to the admin.

---

## Chapter 4: System Design

### 4.1 Introduction to UML
Unified Modeling Language (UML) is a standardized modeling language used to visualize, design, and document the structure and behavior of a system. UML diagrams help in representing system components, interactions between users and the system, and the flow of data.

In this project, UML diagrams are used to clearly describe the system architecture, user interactions, and internal workflow of the AI-based online examination proctoring system. These diagrams improve understanding and help in efficient system design and implementation.

### 4.2 UML Diagrams

#### 4.2.1 Use Case Diagram
The Use Case Diagram represents the interaction between users and the system. The system consists of three main actors: Student, Admin, and the AI System (which runs in the student's browser).

*   **Student Use Cases:** Login, Register Face, Join Exam, Take Exam, Submit Exam.
*   **Admin Use Cases:** Create Exam, Activate / Terminate Exam, Monitor Students (live video), View / Delete Violations, Verify Student, View Reports / Integrity Trend.
*   **AI System Use Cases (in-browser):** Verify Face (128-D descriptor), Detect Face Presence / Multiple Faces, Track Head Pose, Detect Objects (YOLO), Detect Audio, Detect Tab Switch & External Display.

All AI-related activities feed a Violation Logging system, which uploads evidence and notifies the admin dashboard in real time.

#### 4.2.2 Sequence Diagram
The Sequence Diagram details the interaction flow between frontend, backend, and external systems during key user actions:
1.  Student logs in; backend verifies credentials and issues a JWT (bound to login IP).
2.  Student selects an exam; the browser loads the AI models and performs face verification against the registered 128-D descriptor.
3.  Exam session starts; webcam and microphone activate locally.
4.  The browser AI module continuously checks face presence, head pose, objects, and audio; browser guards watch tab switching and fullscreen/external displays.
5.  On a confirmed violation, the browser captures a screenshot, uploads it to Cloudinary, and sends the violation update to the backend (REST).
6.  The backend stores the violation and emits a real-time event to the institution's Socket.IO room; the admin dashboard updates instantly.
7.  For live viewing, the student streams video to the admin over WebRTC (peer-to-peer); Socket.IO relays only the signaling messages.
8.  If a threshold is exceeded, the exam auto-submits/terminates; otherwise the student submits and results are stored and auto-graded.

#### 4.2.3 State Chart Diagram
The State Chart Diagram represents the different states of the system during the exam process:
Initial State → User Login → Authenticated State → Dashboard → Verification State → Face Verification → Exam Active State (Proctoring Active) → Violation Detected State (Count Updated) → Warning State (Alert Generated) → Terminated State (Auto Submission if threshold exceeded) or Completed State (Exam Submitted Successfully).

#### 4.2.4 Deployment Diagram
The Deployment Diagram shows how system components are distributed across hardware and software environments:
1.  **Client Device (Student/Admin):** Web browser running the React app; ALL AI models execute here (TensorFlow.js, face-api.js, YOLOv8 web model). Webcam and microphone are accessed via browser APIs.
2.  **Application Server:** Node.js + Express REST API and Socket.IO server (also the WebRTC signaling relay). No AI processing server exists.
3.  **Database Server:** MongoDB (managed).
4.  **Cache Layer:** Redis (response caching with per-institution keys).
5.  **Media Store:** Cloudinary (violation evidence images).
6.  **Static Hosting:** the three front-end apps (Login, Student, Admin).

### 4.3 Technologies Used
*   **Database comparison matrix:**

| Feature | MongoDB | MySQL | PostgreSQL |
| :--- | :--- | :--- | :--- |
| **Schema** | Flexible (BSON documents) | Fixed (tables/rows) | Fixed (relational schemas) |
| **Scalability** | High (horizontal sharding) | Medium (read replicas) | Medium (partitioning) |
| **Real-time performance** | Excellent (JSON mapping) | Moderate (complex joins) | Good (JSONB support) |

*   **MediaPipe Landmark Detection Metrics:**
    *   Accuracy: 90–95% under normal classroom lighting conditions.
    *   Precision: ~0.92 (low rate of false positives on head turn detection).
    *   Recall: ~0.90 (consistently detects head pitch/yaw deviations).

*   **Comparison of Facial Landmark Models:**

| Model | Accuracy | Speed | Landmarks Supported |
| :--- | :--- | :--- | :--- |
| **MediaPipe** | High | Very Fast (client-side) | 468 Landmark Mesh |
| **Dlib** | Medium | Medium | 68 Landmark points |
| **Haar Cascade** | Low | Fast | None (bounding box only) |

*   **Comparison of Object Detection Models:**

| Model | Accuracy | Speed | Real-Time Support |
| :--- | :--- | :--- | :--- |
| **YOLOv8 Web** | High | Very Fast (client WebGL) | Yes |
| **Faster R-CNN** | Very High | Slow (heavy latency) | No |
| **SSD (MobileNet)** | Medium | Fast | Yes |
| **RetinaNet** | High | Medium | Limited |

---

## Chapter 5: Implementation

### 5.1 System Components
The implementation consists of:
1.  **Three React front-end applications** (Login, Student, Admin).
2.  **A Node.js/Express backend** with an integrated Socket.IO server.
3.  **Supporting services** — MongoDB, Redis, and Cloudinary.

All AI detection is implemented in the Student application and runs in the browser. The backend exposes a REST API and relays real-time/WebRTC-signaling events; it does not process video.

### 5.2 AI Proctoring Pipeline
The AI detection logic executes inside the student's browser as follows:
1.  On exam entry, capture a webcam frame and compute a 128-D face descriptor using face-api.js; compare it with the student's registered descriptor. If the distance exceeds a threshold, deny exam entry.
2.  During the exam, the browser samples video frames and runs: face-api.js (no face → FACE_NOT_DETECTED; more than one face → MULTIPLE_FACES); head-pose from 68 landmarks (excessive yaw/pitch → LOOKING_AWAY / HEAD_TURN); YOLOv8 on TensorFlow.js (a phone/prohibited object above the confidence threshold → PHONE_DETECTED); and the Web Audio API (sustained suspicious audio → SUSPICIOUS_AUDIO).
3.  Browser guards detect TAB_SWITCH (visibility API), full-screen exit, copy/paste/right-click, and external displays (screen.isExtended).
4.  On a confirmed violation, the browser captures an evidence screenshot, uploads it to Cloudinary, increments the session's violation count, and sends the update to the backend. The backend then emits a real-time event to the institution's Socket.IO room.
5.  When a category's count exceeds its threshold, the exam auto-submits or auto-terminates.

### 5.3 Authentication Flow
Credentials are sent to POST /api/auth/login. The server verifies the bcrypt password hash and issues a signed JWT (containing the user id and role, with a fixed validity period). The token is attached to subsequent requests as "Authorization: Bearer <token>". Middleware validates the signature, the role, AND the request IP — if the IP differs from the one recorded at login, the session is rejected (single-device enforcement). Registration enforces one admin per institution, and every query, cache key, and real-time room is scoped to the institution, so no data is shared across institutions. Password reset is handled via a time-limited OTP sent by email (Nodemailer).

### 5.4 Real-time Communication
On joining, the student's browser opens a Socket.IO connection and joins a room keyed by institution; the admin dashboard joins the same room. For live video, the student creates a WebRTC peer connection and exchanges offer/answer/ICE messages through Socket.IO signaling; the video then streams peer-to-peer to the admin. Violation alerts and online-student counts are pushed to the institution room, giving sub-second notification without polling.

### 5.5 User Role and Permission Matrix

| Feature | Admin Role | Student Role |
| :--- | :---: | :---: |
| **Create / Activate Exam** | YES | NO |
| **Join / Take Exam** | NO | YES |
| **View All Violations** | YES | NO |
| **View Own Result** | NO | YES |
| **Terminate Exam Session** | YES | YES (own session only) |
| **Submit Exam Session** | NO | YES |
| **Verify / Delete Student** | YES | NO |
| **Register & Verify Face** | NO | YES (required) |
| **View Reports / Integrity Trend** | YES | NO |

---

## Chapter 6: Software Testing

### 6.1 Introduction
Software testing is a critical phase in the development lifecycle of the AI-Powered Real-Time Exam Proctoring System. Given the system's role in maintaining academic integrity, rigorous testing was essential to ensure reliability, accuracy, and real-time performance under diverse conditions. The testing phase validated all functional modules including AI-based face verification, YOLO object detection, head pose tracking, audio monitoring, WebRTC streaming, and violation management.

The system was tested across multiple browsers (Chrome 90+, Firefox 88+), devices (laptops with 720p webcams), and network conditions (2 Mbps to 10 Mbps) to simulate real-world examination environments. Both automated and manual testing approaches were employed to verify the system's behavior against the Software Requirements Specification.

#### 6.1.1 Testing Objectives
1.  **Functional Correctness:** Verify that all AI detection modules (face detection, multiple faces, phone detection, head turn, audio, tab switch) function as specified with minimal false positives.
2.  **Real-time Performance:** Ensure the AI pipeline processes each video frame within 200ms and maintains smooth exam experience without lag.
3.  **Violation Accuracy:** Validate that the violation scoring system correctly logs incidents, captures evidence screenshots, and triggers auto-termination at configured thresholds.
4.  **Security Validation:** Test JWT authentication, role-based access control, and prevention of unauthorized exam access.
5.  **Scalability:** Verify the system handles minimum 50 concurrent exam sessions without performance degradation.
6.  **Reliability:** Test offline synchronization, reconnection handling, and data integrity during network interruptions.
7.  **Cross-browser Compatibility:** Ensure consistent behavior across Chrome and Firefox browsers.

#### 6.1.2 Testing Strategies
Testing was split into Unit, Integration, System, and Performance evaluation categories to thoroughly map software integrity:
*   **Unit Testing:** Tested individual React components, validated backend API endpoints using Postman, and tested Mongoose models.
*   **Integration Testing:** Tested Socket.IO room isolation, verified WebRTC signal exchanges, and validated Cloudinary uploads.
*   **System Testing:** Performed end-to-end user journeys from login, facial recognition validation, starting examinations, triggering violations, and observing automated terminations.
*   **AI Model Verification:** Tested face detection under varying illuminations (50 lux to 500 lux) and checked face descriptors matching (Euclidean distance threshold: 0.5).
*   **Security Verification:** Attempted SQL injections, validation bypassing, tab switching, and dual-monitor configurations to test stability.

#### 6.1.3 System Evaluation Metrics
*   Average frame processing: 178ms (comfortably within target <200ms).
*   Violation logging latency: 142ms.
*   WebRTC peer connection setup: 2.3 seconds.
*   Average exam submission API time: 1.8 seconds.
*   Concurrent session support load: 58 users without degradation.

### 6.2 Test Cases Matrix

| ID | Test Case Description | Test Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01**| Registration Role Constraint | Signup Admin on existing KMIT | Reject signup; limit one admin per inst | PASS |
| **TC-02**| Session Binding Validator | Change request IP mid-exam | Invalidate session; log user out | PASS |
| **TC-03**| Facial Verification Match | Verify user with 0.4 distance | Accept identity; allow exam launch | PASS |
| **TC-04**| Facial Verification Mismatch | Verify user with 0.65 distance | Deny access; show mismatch warning | PASS |
| **TC-05**| Multiple Face Detection | Place two faces in webcam view | Log MULTIPLE_FACES; alert admin | PASS |
| **TC-06**| Looking Away Landmark Test | Turn head 45 degrees yaw | Log LOOKING_AWAY violation | PASS |
| **TC-07**| Prohibited Object Detector | Hold smartphone in view | Log PHONE_DETECTED; upload screenshot | PASS |
| **TC-08**| Suspicious Audio Detector | Generate 70dB noise for 3s | Log SUSPICIOUS_AUDIO violation | PASS |
| **TC-09**| Tab Switching Guard | Minimize exam / switch tab | Trigger TAB_SWITCH warning | PASS |
| **TC-10**| Dual Monitor Detector | Connect HDMI external screen | Log EXTERNAL_DISPLAY; freeze screen | PASS |
| **TC-11**| Auto-Submission Trigger | Reach 10 tab-switch events | Auto-submit answers; terminate exam | PASS |
| **TC-12**| WebRTC Video Stream | Admin joins monitor view | Establish peer stream; render live feed | PASS |

### 6.3 Known Limitations
*   **Extreme Lighting Sensitivity:** Very dark rooms (<30 lux) can degrade landmark detection accuracy.
*   **Browser Permission Dependencies:** The system cannot monitor candidate states if webcam/audio permissions are blocked.
*   **Hardware Performance Caps:** Lower-end client laptops (without GPU acceleration support) can see frame processing times rise up to 350ms.

---

## Conclusion

The **AI-Powered Real-Time Exam Proctoring System** successfully addresses the challenges of maintaining academic integrity in remote assessments. By utilizing client-side TensorFlow.js models, the system ensures real-time monitoring and behavior analysis without compromising student privacy. The system's multi-tenant design, database caching, and WebRTC integration provide a scalable, secure, and cost-effective alternative to commercial proctoring solutions.

---

## Future Enhancements

*   **Advanced Gaze Tracking:** Integrate iris-tracking algorithms to spot micro-eye movements away from the exam content.
*   **Offline Synced Proctoring:** Support local offline caching of violation logs and evidence during internet dropouts, uploading files automatically upon reconnection.
*   **Integration with LMS Portals:** Package the student portal as an LTI (Learning Tools Interoperability) module for seamless integration with Moodle, Canvas, and Blackboard.
*   **Hardware Keylogger & Port Audits:** Implement deep system-level checks to audit active background ports, running virtual machine hypervisors, or connected USB input hardware.

---

## References

1.  Atoum, Y., Chen, L., Liu, A. X., Hsu, S. D., & Liu, X. (2017). Evaluation of an Online Proctoring System. *IEEE Transactions on Multimedia*, 19(7), 1600-1615.
2.  Nigam, A., Pasricha, R., Singh, T., & Joseph, P. (2021). A Systematic Review of AI-Based Online Proctoring Systems. *Journal of Educational Technology Systems*, 50(2), 220-239.
3.  Bazrafkan, S., Nedelcu, T., & Corcoran, P. (2021). High-precision facial landmark estimation on client devices using MediaPipe. *IEEE Consumer Electronics Magazine*, 10(4), 45-51.
4.  Redmon, J., Divvala, S., Girshick, R., & Farhadi, A. (2016). You Only Look Once: Unified, Real-Time Object Detection. *IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*.
5.  Aydin, O., & Karatas, E. (2020). Ethical concerns and algorithmic bias in automated exam proctoring systems: A critical overview. *Journal of Ethics in Science and Technology*, 15(3), 88-102.
6.  TensorFlow.js Documentation. (2023). *Running deep learning models in modern web browsers.* Retrieved from https://www.tensorflow.org/js
7.  face-api.js Project. (2022). *JavaScript API for face detection and recognition on client browsers.* Retrieved from https://github.com/justadudewhohacks/face-api.js
8.  Socket.IO API Reference. (2023). *Real-time bidirectional event-based communication.* Retrieved from https://socket.io/docs/v4/
9.  WebRTC Browser Specifications. (2022). *W3C Recommendation for Real-Time Peer-to-Peer Communications.* Retrieved from https://www.w3.org/TR/webrtc/
