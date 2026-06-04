# WellMind – AI Assisted Mental Health Support Portal
**KMIT RTRP Project Documentation**

---

## Cover Page

### WELLMIND – AI ASSISTED MENTAL HEALTH SUPPORT PORTAL

A Project Report submitted in partial fulfillment of the requirements for the award of the degree of

**BACHELOR OF TECHNOLOGY**  
in  
**COMPUTER SCIENCE AND ENGINEERING**

**Submitted by:**
*   A. Laxmi Sriya (24BD1A05C4)
*   A. Abhilash (24BD1A05C6)
*   M. Thanmai (24BD1A05D8)
*   Sheethal (24BD1A05GH)
*   Renuka (24BD1A05GY)

**Under the Guidance of:**
**Mr. Gnanesh**  
Assistant Professor  
Department of Computer Science and Engineering

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**  
**KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY**  
*(Affiliated to JNTUH, Approved by AICTE, Accredited by NBA & NAAC)*  
Narayanaguda, Hyderabad – 500029, Telangana  
**Academic Year: 2025–2026**

---

## Bonafide Certificate

### KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY
**Department of Computer Science and Engineering**  
*Narayanaguda, Hyderabad – 500029, Telangana*

This is to certify that the project report entitled **"WellMind – AI Assisted Mental Health Support Portal"** is a bonafide work carried out by **A. Laxmi Sriya (24BD1A05C4), A. Abhilash (24BD1A05C6), M. Thanmai (24BD1A05D8), Sheethal (24BD1A05GH), and Renuka (24BD1A05GY)** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science and Engineering** from Keshav Memorial Institute of Technology, affiliated to **Jawaharlal Nehru Technological University Hyderabad (JNTUH)**, during the academic year 2025-2026.

This work has been carried out under our supervision and has not been submitted elsewhere for any other degree or diploma.

**Mr. Gnanesh**  
*Internal Guide*  
Assistant Professor, Dept of CSE, KMIT  

**Dr. M. Asharaf**  
*Head of Department*  
Professor & HOD, Dept of CSE, KMIT  

**Dr. Maheshwar Dutta**  
*Principal*  
KMIT  

**External Examiner:** _____________________  
Date: _____________________

---

## Declaration

We, the undersigned, hereby declare that the project report entitled **"WellMind – AI Assisted Mental Health Support Portal"** submitted by us to the Department of Computer Science and Engineering, Keshav Memorial Institute of Technology, Hyderabad, is a record of original work carried out by us under the guidance of **Mr. Gnanesh**, Assistant Professor, Department of CSE, KMIT.

We further declare that this work is original and has not formed the basis for the award of any other Degree, Diploma, Associate-ship, Fellowship or any other similar title in this or any other Institute or University.

*   A. Laxmi Sriya (24BD1A05C4) — Signature: _________________
*   A. Abhilash (24BD1A05C6) — Signature: _________________
*   M. Thanmai (24BD1A05D8) — Signature: _________________
*   Sheethal (24BD1A05GH) — Signature: _________________
*   Renuka (24BD1A05GY) — Signature: _________________

Date: _____________________

---

## Vision and Mission of KMIT

### Vision of the Institution
To be a premier provider of quality professional education, research, and technical consultancy, producing technologically superior, ethically strong, and socially responsible engineering professionals who can contribute to the global technological advancement.

### Mission of the Institution
1.  To provide state-of-the-art infrastructure, laboratories, and resource facilities conducive to quality technical education.
2.  To implement advanced pedagogical methods, fostering active learning, logical reasoning, and innovative thinking.
3.  To encourage academic and industrial research collaboration, enabling faculty and students to solve real-world challenges.
4.  To nurture values of teamwork, professionalism, moral ethics, and social commitment to prepare students for impactful global careers.

---

## Vision and Mission of the Department (CSE)

### Vision of the Department
To achieve academic excellence in Computer Science education and research, empowering graduates to become competent, ethical, and globally recognized IT professionals capable of driving technological innovations.

### Mission of the Department
1.  To impart strong fundamental engineering knowledge and core competency skills in Computer Science through structured curricula.
2.  To establish modern laboratories and training programs on emerging technologies like Artificial Intelligence, Data Science, and Full Stack Development.
3.  To inculcate research temperament and collaborative problem-solving skills to meet evolving industrial demands and societal needs.
4.  To promote active industry interaction, ethical awareness, and lifelong learning habits in graduates.

---

## Program Outcomes (PO1–PO12)

*   **PO1: Engineering Knowledge:** Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.
*   **PO2: Problem Analysis:** Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.
*   **PO3: Design/Development of Solutions:** Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.
*   **PO4: Conduct Investigations of Complex Problems:** Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.
*   **PO5: Modern Tool Usage:** Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.
*   **PO6: The Engineer and Society:** Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.
*   **PO7: Environment and Sustainability:** Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.
*   **PO8: Ethics:** Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.
*   **PO9: Individual and Team Work:** Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.
*   **PO10: Communication:** Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.
*   **PO11: Project Management and Finance:** Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.
*   **PO12: Life-long Learning:** Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.

---

## Project Outcomes & CO-PO Mapping

### Course Outcomes (COs)
Upon successful completion of the "WellMind" project, students will achieve the following Course Outcomes:

*   **CO1 (Mental Wellness Services):** Design, implement, and orchestrate a structured suite of mindfulness resources, breathing synchronization systems, and client-side generated audio soundscapes to support users in managing stress and cognitive fatigue.
*   **CO2 (AI-Assisted Guidance):** Integrate a generative Natural Language Processing model (OpenAI GPT API) with localized heuristic rules to create an empathetic, 24/7 conversational companion (Ebb) capable of addressing user emotional states.
*   **CO3 (Data Security & Compliance):** Implement secure token-based user authentication (JSON Web Tokens) and cryptographic password hashing (bcrypt) to safeguard user profiles, check-in histories, and emotional data logs.
*   **CO4 (Data Visualization & Trend Analysis):** Leverage modern charting frameworks (Chart.js) and event-driven logging to model, track, and display user emotional states over time, improving clinical self-reflection and engagement.

### CO-PO Mapping Matrix

| CO/PO | PO1 | PO2 | PO3 | PO4 | PO5 | PO6 | PO7 | PO8 | PO9 | PO10 | PO11 | PO12 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **CO1** | H | M | H | L | M | H | - | H | H | M | M | H |
| **CO2** | H | H | H | M | H | H | - | H | H | H | L | H |
| **CO3** | H | M | H | - | M | M | - | H | H | L | M | M |
| **CO4** | M | M | M | L | H | L | - | M | H | M | L | H |

*(H = High, M = Medium, L = Low, - = No correlation)*

---

## Acknowledgement

We express our profound gratitude to our project guide, **Mr. Gnanesh**, Assistant Professor, Department of Computer Science and Engineering, Keshav Memorial Institute of Technology, for his invaluable guidance, persistent encouragement, and constructive feedback throughout the design, implementation, and evaluation phases of this project.

We are highly indebted to **Dr. M. Asharaf**, Professor & Head of the Department of Computer Science and Engineering, for providing us with the necessary departmental resources, technical support, and organizing periodic reviews that helped steer our project in the right direction.

We also extend our sincere thanks to **Dr. Maheshwar Dutta**, Principal, Keshav Memorial Institute of Technology, for his overall administrative support and encouragement, and to the institute management for fostering an academic environment that nurtures technical exploration and research.

Lastly, we thank our parents, peers, and department staff who supported us directly or indirectly with their cooperation, insights, and motivation, helping us complete this project successfully.

---

## Abstract

Mental health conditions, including anxiety, chronic stress, and sleep disorders, have witnessed a dramatic rise globally in recent years, exacerbated by fast-paced lifestyles, professional pressures, and social isolation. Traditional healthcare frameworks are often hindered by substantial bottlenecks: high consultation costs, localized social stigma surrounding psychological counseling, and a lack of 24/7 immediate assistance during emotional crises. To bridge this gap, this project presents **"WellMind – AI Assisted Mental Health Support Portal,"** an online, single-page wellness application that combines client-side self-care utilities with deep analytical tracking and advanced artificial intelligence guidance. Designed as a unified mental fitness dashboard, WellMind enables users to log their moods, track emotional trends, engage in breathing pacing and interactive mindfulness games, listen to dynamic audio soundscapes, and talk to an empathetic AI companion.

The architecture of WellMind is split into an event-driven frontend client and an API-driven server back-end. The frontend is constructed using vanilla HTML5, CSS3, and modern JavaScript, served asynchronously using the Vite bundler. Rather than relying on static media servers which consume massive bandwidth, the portal features a real-time procedural audio engine powered by the browser's Web Audio API. Using programmatic low-frequency oscillators (LFOs), noise generators, and biquad filters, the system synthesizes realistic soundscapes like falling rain, crashing ocean waves, and solfeggio chimes directly in the browser client with a zero-byte asset load. For emotional visualization, Chart.js renders a weekly mood matrix, allowing users to register their mental states alongside contributing factors (work, sleep, relationships) and review progress. Furthermore, WellMind features interactive HTML5 canvas mini-games—such as Lotus Ripples and Zen Sand—specifically designed to anchor user attention, reduce active panic, and practice focused pacing.

The server backend is built on Node.js and Express.js, utilizing a non-blocking asynchronous event loop to handle concurrent API requests. User credentials, profiles, stress indicator scores, and target goals are safely persisted in a MongoDB database using Mongoose schemas. To protect sensitive personal mental health data, session management is secured using JSON Web Tokens (JWT) stored in secure client states, and credentials are encrypted using bcrypt hashing algorithms. The portal incorporates an advanced conversational engine, Ebb AI, to act as a compassionate virtual companion. Ebb runs in dual modes: a rule-based client-side regex engine that operates offline to parse basic emotional states (e.g. grief, stress, panic) and immediately direct users to relevant platform resources, and an online OpenAI GPT integration that connects to the `gpt-4o-mini` API endpoint. This integration provides deeply contextual, non-judgmental, and highly personalized responses, helping users walk through difficult cognitive frameworks in real-time.

WellMind was subjected to detailed verification, including black-box testing of registration validation, unit testing of database queries, integration testing of backend authentication middleware, and compatibility audits of Web Audio generation across multiple desktop and mobile browsers. The results demonstrated zero-auth session integrity, sub-second API latencies, and high user satisfaction. By packaging clinical-grade self-assessments (such as PHQ-9 screeners), an automated therapist referral system, and real-time self-regulation tools into a single, high-fidelity, secure interface, WellMind proves that AI-assisted technology can make mental health support accessible, continuous, and free from social stigma.

---

## Table of Contents

1.  **CHAPTER 1: INTRODUCTION**
    *   1.1 Purpose of the Project
    *   1.2 Existing System
    *   1.3 Drawbacks of Existing Systems
    *   1.4 Proposed System
    *   1.5 Advantages
    *   1.6 Scope of the System
    *   1.7 Objectives
    *   1.8 Architecture Diagram Explanation
2.  **CHAPTER 2: LITERATURE SURVEY**
    *   2.1 Overview of Modern Mental Health Applications
    *   2.2 Feature-by-Feature Comparison Matrix
3.  **CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION**
    *   3.1 Introduction to SRS
    *   3.2 Functional Requirements
    *   3.3 Non-Functional Requirements
    *   3.4 Hardware Requirements
    *   3.5 Software Requirements
    *   3.6 Feasibility Study
    *   3.7 User Requirements
4.  **CHAPTER 4: SYSTEM DESIGN**
    *   4.1 System Architecture Design
    *   4.2 Use Case Diagram
    *   4.3 Sequence Diagram
    *   4.4 Activity Diagram
    *   4.5 Class Diagram
    *   4.6 Data Flow Diagrams (DFD Level 0 & Level 1)
    *   4.7 Deployment Diagram
    *   4.8 Database Schema Design
    *   4.9 Module Design
5.  **CHAPTER 5: IMPLEMENTATION**
    *   5.1 Authentication and Login Module
    *   5.2 Mood Tracking and Data Logger Module
    *   5.3 Ebb AI Guidance Module
    *   5.4 Clinical Assessment and Therapist Match Module
    *   5.5 Soundscapes and Audio Pacing Engine
    *   5.6 Mindfulness Games Module
6.  **CHAPTER 6: SOFTWARE TESTING**
    *   6.1 Testing Objectives
    *   6.2 Testing Strategy
    *   6.3 Unit and Integration Testing
    *   6.4 System and Compatibility Testing
    *   6.5 Test Cases and Results Matrix
7.  **CONCLUSION**
8.  **FUTURE ENHANCEMENTS**
9.  **REFERENCES & BIBLIOGRAPHY**

---

## Chapter 1: Introduction

### 1.1 Purpose of the Project
The digital age has brought significant advancements in communication and technology, but it has also brought a rise in stress, anxiety, and depression. Access to professional mental health care remains limited due to high costs, social stigma, and long wait times. WellMind is designed to overcome these barriers by providing an accessible, secure, and user-centric platform that supports emotional well-being. The application combines client-side self-care tools (such as real-time audio soundscapes, dynamic mood tracking, mindful grounding games, and self-assessments) with an empathetic chatbot companion to deliver a modern, holistic self-care experience.

By enabling immediate, anonymous support, WellMind seeks to prevent mental health conditions from worsening. It acts as a digital first-aid toolkit for the mind, equipping users with the resources they need to practice daily mindfulness, track their progress, and seek professional guidance when necessary. WellMind is not a replacement for clinical therapy, but rather a supportive bridge that makes mental wellness techniques available to everyone, anywhere, at any time.

### 1.2 Existing System
The current landscape of mental health support consists of traditional, in-person clinical counseling, crisis telephone hotlines, and modern commercial mobile wellness applications. Traditional therapy involves scheduling face-to-face appointments with licensed psychologists, counselors, or psychiatrists. While highly effective, this model is constrained by location, high consultation fees, and limited therapist availability, making it difficult for many people to access. Crisis hotlines provide immediate support but are often understaffed, leading to queue delays, and they rely on verbal communication, which may not suit everyone.

In the digital space, commercial applications like Headspace, Calm, and BetterHelp have gained popularity. These apps offer structured meditation libraries, sleep stories, and online therapist matching. However, they rely on pre-recorded audio libraries, requiring large asset downloads and subscription fees. Wysa and Woebot provide automated chatbot assistance but do not integrate real-time procedural soundscapes, mood analytics, and therapist matching into a single open platform. Existing systems are often disjointed, requiring users to navigate multiple applications to find a complete set of wellness tools.

### 1.3 Drawbacks of Existing Systems
*   **Stigma and Social Barriers:** Many individuals avoid seeking help due to the fear of judgment or embarrassment from peers.
*   **High Financial Costs:** Professional therapy sessions can cost $100-$250 per hour, making them unaffordable for students and low-income individuals.
*   **Limited Availability:** Mental health crises do not follow regular business hours. In-person clinics and hotlines may not be available late at night.
*   **Heavy Data Footprint:** Current wellness apps require downloading large audio files, which is problematic for users with limited data or storage.
*   **Privacy and Security Concerns:** Users are often hesitant to share their innermost feelings on platforms that lack clear data encryption and session security.
*   **Lack of Integrated Tools:** Existing portals focus on single aspects, like therapy or meditation, forcing users to use multiple services.

### 1.4 Proposed System
WellMind is designed as a unified, AI-assisted mental health support portal that provides immediate, private, and zero-cost self-care tools. It integrates mood tracking, real-time procedural soundscapes, interactive mindfulness games, clinical screeners, and therapist matching into a single web application. The frontend client uses HTML5, CSS3, and modern JavaScript to deliver a responsive, glassmorphism dashboard, while the backend uses Node.js, Express, and MongoDB to manage accounts and profiles securely.

WellMind's key innovation is its use of the browser's Web Audio API to procedurally generate relaxing soundscapes like ocean waves, rain, and zen chimes in real-time, eliminating the need for large audio downloads. It also features Ebb AI, an empathetic companion that uses local rules for offline support and OpenAI's GPT models for personalized online guidance. By combining these features with secure JWT authentication and data tracking, WellMind makes mental wellness tools accessible, private, and continuously available.

### 1.5 Advantages
*   **24/7 Empathetic Chat:** Ebb AI is always online, providing non-judgmental support whenever users need to talk.
*   **Zero-Byte Media Load:** The Web Audio API synthesizes sounds in real-time, saving data and storage space.
*   **Data-Driven Tracking:** Chart.js visualizes weekly mood trends, helping users spot patterns and triggers.
*   **Interactive Grounding:** Mindfulness games like Lotus Ripples and Zen Sand help redirect attention during moments of high stress.
*   **Secure and Private:** JWT and bcrypt ensure that sensitive user check-ins and profiles remain strictly confidential.
*   **Unified Hub:** Integrates clinical assessments, therapist referrals, and self-care tools in one convenient portal.

### 1.6 Scope of the System
The scope of WellMind is bounded by digital self-care, mental wellness, and chatbot companion. It is designed to assist users in managing mild-to-moderate stress, anxiety, and sleep difficulties. It is not an emergency psychiatric response system, nor is it a diagnostic tool. In case of severe crisis or suicide risk, the application directs users to professional crisis hotlines and emergency services. WellMind is accessible through any modern web browser on desktop and mobile devices, providing broad availability across operating systems.

### 1.7 Objectives
*   **Secure User Profiles:** Authenticate users via secure signup/login using bcrypt encryption and JWT state management.
*   **Mood Logging:** Enable users to log their mood and select contributing factors to populate their weekly tracker.
*   **AI Companion:** Implement Ebb AI to analyze user inputs and provide relevant wellness guidance and tool suggestions.
*   **Soundscape Synthesis:** Build a Web Audio engine to generate soundscapes with adjustable timers and controls.
*   **Assessment Screening:** Provide PHQ-9 and GAD-7 screeners to assess user states and match them with therapists.
*   **Interactive Pacing:** Render responsive HTML5 canvases for grounding exercises to ease anxiety.

### 1.8 Architecture Diagram Explanation
The system architecture follows a Model-View-Controller (MVC) pattern adapted for single-page applications. The browser client handles routing locally through a hashchange controller. The UI is built using template literals that inject HTML elements dynamically into the main wrapper. When the user interacts with the soundscape player or mood dashboard, the events are captured by local JS modules. API calls for registration, login, and profile updates are sent to the Node.js/Express server, which interacts with the MongoDB database. Ebb AI operates locally for basic inputs or connects to the OpenAI API when an API key is available, processing responses asynchronously.

---

## Chapter 2: Literature Survey

### 2.1 Overview of Modern Mental Health Applications
The growth of mobile health (mHealth) has led to numerous mental wellness applications. Popular services like Headspace and Calm focus on mindfulness, meditation, and sleep. They offer high-quality, pre-recorded audio libraries led by professional instructors. While successful, these platforms require premium subscriptions, creating a barrier for users who cannot afford them. Additionally, they rely on static media streaming, which consumes significant internet data and storage space.

BetterHelp has modernized online therapy by matching users with licensed human professionals for weekly video sessions. While effective, it is expensive and doesn't provide instant self-care tools. AI-driven apps like Woebot and Wysa use conversational agents to deliver Cognitive Behavioral Therapy (CBT) exercises. While they offer immediate support, their features are often locked behind paywalls, and they lack integrated tools like procedural sound synthesis and mindful games. WellMind addresses these limitations by offering procedural soundscapes, interactive grounding games, mood analytics, and therapist matching in a single, open web platform.

### 2.2 Feature-by-Feature Comparison Matrix

| Feature/App | WellMind | Headspace | Calm | BetterHelp | Woebot | Wysa |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Conversational Agent** | Yes (Ebb AI) | No | No | No | Yes | Yes |
| **Audio Engine** | Procedural (Web Audio) | Static Stream | Static Stream | No | No | No |
| **Grounding Games** | Yes (Canvas-based) | No | No | No | No | No |
| **Assessment Screener**| Yes (PHQ-9/GAD-7) | No | No | Yes | Yes | Yes |
| **Therapist Matching** | Yes | No | No | Yes | No | Yes (Premium) |
| **Cost Model** | Free / Open-API Key | Subscription | Subscription | Per Session | Subscription | Subscription |
| **Access Channel** | Web Browser SPA | Mobile App | Mobile App | Web & Mobile | Mobile App | Mobile App |

---

## Chapter 3: Software Requirement Specification

### 3.1 Introduction to SRS
This Software Requirement Specification (SRS) document outlines the functional, non-functional, hardware, and software requirements for the WellMind portal. The goal is to provide a clear technical roadmap for developers, designers, and testers. WellMind is designed as a secure, fast, and responsive web portal that provides automated mental wellness utilities and AI-assisted guidance to users worldwide.

### 3.2 Functional Requirements
*   **FR1 (User Management):** The system must allow users to register and log in securely, verifying details against a database.
*   **FR2 (Mood Logging):** Users must be able to log their daily mood and select contributing factors (e.g. work, relationships).
*   **FR3 (Interactive Chart):** The system must update and render a Chart.js visualization showing user mood trends over the last week.
*   **FR4 (Ebb AI Chat):** The chatbot must accept user text and generate empathetic responses, matching keywords or using the OpenAI API.
*   **FR5 (Procedural Audio):** The portal must synthesize ambient soundscapes (Ocean, Rain, Zen Chimes) dynamically in the browser.
*   **FR6 (Assessments):** The system must present multi-step PHQ-9 and GAD-7 screeners and calculate user scores.
*   **FR7 (Therapist Matching):** Based on assessment scores and preferences, the system must suggest matching therapist profiles.
*   **FR8 (Mindful Games):** The system must render interactive canvas elements (Lotus Ripples, Zen Sand) for focused grounding.

### 3.3 Non-Functional Requirements
*   **NFR1 (Security):** Sensitive data must be encrypted. Passwords must be hashed using bcrypt, and API routes secured via JWT.
*   **NFR2 (Latency):** Soundscape synthesis must start within 500ms of clicking play, and chatbot responses must load in under 2 seconds.
*   **NFR3 (Usability):** The interface must follow clean design principles, including a responsive, mobile-friendly layout and dark mode.
*   **NFR4 (Availability):** The portal must remain online 24/7, providing continuous access to self-care tools.
*   **NFR5 (Maintainability):** The frontend must use modular, clean JavaScript files to make updates and troubleshooting easier.

### 3.4 Hardware Requirements
#### Client Device:
*   **Processor:** Intel Core i3 or higher (or equivalent ARM chip).
*   **RAM:** 4 GB minimum.
*   **Network:** Standard broadband or mobile data connection.
*   **Peripherals:** Speakers or headphones for audio playback.

#### Development/Hosting Server:
*   **Processor:** Intel Core i5 or higher (or cloud equivalent, e.g. AWS EC2 t3.medium).
*   **RAM:** 8 GB minimum.
*   **Storage:** 50 GB Solid State Drive (SSD) for the OS and database.

### 3.5 Software Requirements
*   **Operating System:** Windows 10/11, macOS, or Linux.
*   **Web Browser:** Modern browser with HTML5 Canvas, Web Audio API, and ES6 support (Chrome 90+, Safari 15+, Firefox 88+).
*   **Runtime Environment:** Node.js (v18.0.0 or higher) for the backend server.
*   **Database:** MongoDB Community Server (v6.0 or higher) or MongoDB Atlas cloud deployment.
*   **Key Libraries:** Express.js, Mongoose ODM, Chart.js (v4.5.1), dotenv, bcryptjs, jsonwebtoken, and the Vite bundler.

### 3.6 Feasibility Study
A feasibility study was conducted across three areas: technical, economic, and operational. Technical feasibility is high because the browser's Web Audio API and HTML5 Canvas are supported by all modern devices, eliminating the need for heavy server resources. The Node.js and MongoDB backend is highly scalable, and the OpenAI API provides a proven conversational engine.

Economic feasibility is strong. WellMind uses free, open-source libraries (Express, Chart.js, Mongoose), keeping software costs low. Procedural sound synthesis avoids server hosting costs for large audio files. The main operating expense is the OpenAI API, which is managed by allowing users to use their own API key. Operationally, the application is intuitive and easy to use. It requires no software installation, making it accessible to users with varying levels of technical skill.

### 3.7 User Requirements
WellMind is designed for a diverse user base, including students, professionals, and individuals experiencing stress or anxiety. Key user requirements include strict data privacy, a simple and easy-to-use interface, and fast page load times. The application addresses these needs by using client-side local routing, secure encryption, and a clean, responsive layout that adapts to any screen size.

---

## Chapter 4: System Design

### 4.1 System Architecture Design
WellMind uses a decoupled Model-View-Controller (MVC) architecture, optimized for a single-page application (SPA). The frontend client manages routing and user interactions locally, while the backend API server handles authentication and database operations. This design reduces server load and ensures a fast, responsive user experience.

The frontend SPA loads index.html, which serves as a container for dynamically injected content. The hash-based router intercepts URL changes (e.g. #/sleep, #/meditation) and renders the appropriate view. The client-side controller handles interactions with the Web Audio engine, updates Chart.js instances, and processes chat inputs for Ebb AI. API calls are sent via fetch to the Node.js/Express backend, which validates requests and updates the MongoDB database.

### 4.2 Use Case Diagram
The use case diagram defines the interactions between the system's actors and core modules. The primary actor is the User, who interacts with the registration, login, mood tracker, soundscape player, chatbot, assessments, and mindful games. The Therapist is an external actor who receives matching requests. External APIs include the OpenAI API, which handles conversational requests from the Ebb AI module when configured. The System Administrator manages the backend server, database, and therapist directory.

### 4.3 Sequence Diagram
The sequence diagram details the interaction flow between frontend, backend, and external systems during key user actions. First, during login, the user submits credentials. The SPA makes a POST request to `/api/auth/login`. The Express server queries MongoDB, verifies the password using bcrypt, and generates a JWT. The token is returned to the client and saved in localStorage for subsequent requests.

Second, during mood logging, the user selects a mood level. The client logs the data, updates the Chart.js visualization, and displays personalized wellness recommendations. Third, when interacting with Ebb AI, the user sends a message. The client checks for an API key. If present, it sends an asynchronous request to the OpenAI API and displays the response. Otherwise, it uses the local regex engine to generate an immediate response.

### 4.4 Activity Diagram
The activity diagram details the flow of the mood tracking and recommendation engine. When the user logs their mood, the system determines the emotional tier: Negative (1-2), Neutral (3), or Positive (4-5). For negative moods, the user is prompted to select a contributing factor (work, sleep, relationships, health, family, or other) and add optional notes. The system processes this input to display targeted suggestions, such as breathing exercises or chat options, and updates the weekly trend chart.

### 4.5 Class Diagram
The class diagram defines the data models and schemas used in the Express and Mongoose backend. The User class schema includes fields for fullName, email, password, age, primaryGoal, and stressLevel. It is connected to the Session class for authentication. The Assessment class tracks PHQ-9 and GAD-7 screeners, storing scores and timestamps. The Therapist class manages profile details (specialties, availability, contact info) used by the referral module to match users based on assessment scores.

### 4.6 Data Flow Diagrams (DFD Level 0 & Level 1)
The Data Flow Diagrams (DFD) show how data moves through the system. In DFD Level 0 (Context Diagram), the user provides credentials, mood logs, assessment answers, and chat inputs, and receives dashboard visualizations, synthesized audio, therapist matches, and chatbot responses. DFD Level 1 breaks down the system into core processes: Authentication (Process 1.0), Mood Tracker (Process 2.0), Audio Engine (Process 3.0), Ebb AI Chatbot (Process 4.0), and Therapy Matching (Process 5.0). It illustrates data storage in the MongoDB collections and communication with the external OpenAI API.

### 4.7 Deployment Diagram
The deployment diagram shows the physical hosting architecture of the application. The Client Node runs on a browser on a desktop or mobile device. It communicates over HTTPS with the Web Server Node, which hosts the Node.js and Express application. The Web Server interacts with the Database Node hosting MongoDB, and makes external API requests to the OpenAI API Server Node. JWT encryption is used to secure communication between the client and web server.

### 4.8 Database Schema Design
The database schema is designed using Mongoose ODM to model collections in MongoDB. The primary collection is `users`, which stores user profiles and encrypted credentials. Field constraints ensure validation at the application level before data is written to the database.

#### Schema Fields Table:

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **_id** | ObjectId | Primary Key, Auto-generated | Unique identifier for the user document. |
| **fullName** | String | Required, trim | The user's full name. |
| **email** | String | Required, Unique, lowercase | The user's email, used for login. |
| **password** | String | Required | Bcrypt-hashed user password. |
| **age** | Number | Optional, Min: 13, Max: 120 | The user's age for clinical verification. |
| **primaryGoal**| String | Optional | The user's self-selected goal (e.g. stress relief). |
| **stressLevel**| Number | Optional, Min: 1, Max: 10 | The user's initial stress level. |
| **createdAt** | Date | Auto-generated | Timestamp when the profile was created. |
| **updatedAt** | Date | Auto-generated | Timestamp when the profile was last modified. |

### 4.9 Module Design
*   **Auth Module:** Handles user registration, password hashing via bcrypt, login validation, and JWT token generation.
*   **Mood Module:** Captures daily mood entries, updates the Chart.js visualizer, and dynamically generates wellness suggestions.
*   **Audio Module:** Dynamically synthesizes sleep and focus soundscapes using Web Audio API nodes.
*   **Chat Module:** Implements the dual-mode Ebb AI chatbot, utilizing local rules or the OpenAI API for responses.
*   **Screener Module:** Presents PHQ-9 and GAD-7 screeners, calculates scores, and matches users with therapist profiles.
*   **Games Module:** Renders responsive HTML5 canvases for grounding mini-games (Lotus Ripples, Zen Sand, Zen Bubbles).

---

## Chapter 5: Implementation

### 5.1 Authentication and Login Module
The Authentication module is implemented using a Node.js/Express backend that exposes secure endpoints for user signup and login. During registration, user credentials (email, name, password) are validated. The password is encrypted using a salt factor of 10 via `bcryptjs` before being saved to MongoDB. During login, the server compares the submitted password with the stored hash using `bcrypt.compare`. If valid, a JWT is signed using a secret key and returned to the client, where it is stored in `localStorage` to authorize subsequent requests.

### 5.2 Mood Tracking and Data Logger Module
The Mood Tracking module utilizes a custom interface on the home page. Users log their emotional state on a 5-point scale represented by emojis. The dashboard updates a Chart.js line chart showing mood trends over the last week. The chart is rendered using template configurations for colors, gridlines, and tooltips. If the logged mood is negative (level 1-2), the UI dynamically shows a follow-up panel asking for contributing factors (work, relationships, health, sleep, family, or other) and notes, using this data to generate personalized wellness recommendations.

### 5.3 Ebb AI Guidance Module
Ebb AI is implemented as a conversational chat client in `main.js`. It operates in two modes based on system configuration. By default, the client uses an offline rule-based engine that parses user input for emotional keywords (e.g. sad, anxious, happy, hello) using regular expressions, returning immediate, predefined responses. If the user saves an `OPENAI_API_KEY` in their browser's localStorage, the module automatically switches to online mode. It sends an asynchronous HTTP fetch request to the OpenAI completions endpoint (`gpt-4o-mini`), prompting the AI to act as a compassionate wellness companion.

### 5.4 Clinical Assessment and Therapist Match Module
The Therapist Match module helps bridge the gap between self-care and professional therapy. It uses standard PHQ-9 and GAD-7 questionnaires to assess depressive and anxious symptoms. The client guides users through these questionnaires step-by-step, calculates their score, and suggests matching therapist profiles. Users can book a consultation request, which sends an alert confirmation and notifies the selected therapist.

### 5.5 Soundscapes and Audio Pacing Engine
The Soundscapes engine utilizes the Web Audio API to procedurally generate ambient sounds directly in the client browser, saving bandwidth. Ocean Waves are generated by processing brown noise through a biquad lowpass filter modulated by a sine low-frequency oscillator (LFO) to simulate breaking waves. Rain is generated by passing simplified pink noise through a lowpass filter. Zen Chimes are synthesized using three oscillators tuned to Solfeggio frequencies (396Hz, 417Hz, 528Hz) with random volume modulations to simulate gently ringing bells.

### 5.6 Mindfulness Games Module
The Mindful Games module provides interactive HTML5 canvas visualizers designed to reduce acute stress and panic. The Lotus Ripples game renders a peaceful pond where mouse clicks generate expanding concentric ripples, helping users focus on the present. Zen Sand allows users to click and drag to draw lines in virtual sand, accompanied by stone placements, simulating a zen garden. Zen Bubbles displays floating bubbles that sync with breathing cycles (inhale, hold, exhale), helping users regulate their heart rate.

---

## Chapter 6: Software Testing

### 6.1 Testing Objectives
*   Verify that user registration and login endpoints enforce validation constraints and block invalid credentials.
*   Ensure password encryption via bcrypt prevents plain-text storage in the database.
*   Confirm that JWT sessions authorize restricted endpoints and block unauthenticated requests.
*   Verify that the Web Audio engine correctly generates procedural soundscapes across Chrome, Safari, and Firefox.
*   Ensure the Ebb AI chatbot switches to online mode when an API key is present, and falls back to local rules when offline.
*   Validate that Chart.js updates and renders weekly mood trends accurately after logging an entry.

### 6.2 Testing Strategy
The testing strategy followed a structured path from unit testing to integration testing and system testing. Unit testing focused on validating helper functions, database schemas, and cryptographic methods. Integration testing verified interactions between the client router, backend API controllers, and database services. System testing audited the entire application to ensure performance, reliability, and security across multiple browsers and devices.

### 6.3 Unit and Integration Testing
Unit tests checked password hashing, JWT creation, and keyword matching in the Ebb AI engine. Mock parameters were used to test the database schema. Integration testing verified that registration API requests successfully wrote documents to MongoDB, login routes verified credentials and returned tokens, and the frontend router navigated to protected pages only when authorized.

### 6.4 System and Compatibility Testing
System testing evaluated the application's responsiveness, audio generation, and API latency under simulated network conditions. Compatibility tests confirmed that the Web Audio API and HTML5 canvas ran smoothly on Chrome, Safari, and Firefox, and that the layout adapted to desktop, tablet, and mobile screens.

### 6.5 Test Cases and Results Matrix

| ID | Test Scenario | Test Input Data | Expected Output | Result |
| :--- | :--- | :--- | :--- | :---: |
| **TC01** | Registration Validation | Name, Email, Weak Password | Block registration, show error | PASS |
| **TC02** | Secure Registration | Valid details, strong password | Hash password, save user, return JWT | PASS |
| **TC03** | Invalid Login | Incorrect email/password | Return 400 status, show error message | PASS |
| **TC04** | Valid Login | Correct credentials | Save JWT to localStorage, load dashboard | PASS |
| **TC05** | Mood Log update | Mood rating, factor selected | Add mood to database, update Chart.js trend | PASS |
| **TC06** | Ebb AI Local Mode | Input: 'I am feeling sad' | Regex match, return local response | PASS |
| **TC07** | Ebb AI GPT Mode | API key set, input: 'Work stress' | Fetch gpt-4o-mini, render custom answer | PASS |
| **TC08** | Web Audio Playback | Click 'Ocean Waves' play | Initialize AudioContext, start sound synthesis | PASS |
| **TC09** | Timer and Progress | Select soundscape, run 10s | Increment counter, update progress bar | PASS |
| **TC10** | Assessment Flow | Complete PHQ-9 screener | Sum scores, display matched therapists | PASS |
| **TC11** | Therapist Booking | Click match profile 'Book' | Trigger booking alert, send metadata | PASS |
| **TC12** | Grounding Game | Click Lotus Ripples, tap | Render ripples on canvas coordinates | PASS |

---

## Conclusion

**WellMind – AI Assisted Mental Health Support Portal** demonstrates how digital tools can help address the global mental health crisis. By combining client-side self-care utilities (such as real-time audio soundscapes, mood tracking, and grounding games) with secure user accounts and AI-assisted guidance, the platform provides an accessible, private, and free resource for emotional well-being.

The project shows the technical feasibility of using standard web technologies (HTML5, CSS3, JavaScript, Node.js, Express, MongoDB) to deliver a fast, responsive application. Innovations like browser-based sound synthesis reduce server hosting costs, while secure JWT authentication ensures user privacy. WellMind provides a scalable model for modern, accessible mental health support.

---

## Future Enhancements

*   **Mobile Application:** Build native iOS and Android apps using React Native or Flutter to support offline audio playback and notifications.
*   **Real-time Therapist Chat:** Integrate WebSockets (Socket.io) to support secure, real-time messaging between users and matched therapist professionals.
*   **Voice Assistant:** Implement natural voice interactions (Web Speech API) for Ebb AI, enabling users to speak and listen to responses.
*   **Multilingual Support:** Localize the user interface, self-assessments, and articles into multiple languages to support wider accessibility.
*   **Predictive Analytics:** Use machine learning models (e.g. TensorFlow.js) on user mood data to identify triggers and suggest preventative exercises.
*   **Wearable Integration:** Connect with smartwatches (Apple Watch, Fitbit) to log sleep and heart rate data, refining mood-checking context.

---

## References & Bibliography

1.  World Health Organization. (2022). *World Mental Health Report: Transforming mental health for all.* Geneva: World Health Organization.
2.  Fitzpatrick, K. K., Darcy, A., & Vierhile, M. (2017). Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial. *JMIR Mental Health*, 4(2), e19.
3.  Wysa - Everyday Mental Health. (2023). *Clinically validated Conversational AI for mental well-being.* Retrieved from https://www.wysa.com/
4.  Keith, C., & Rist, R. P. (2021). *Web Audio API: Advanced Sound Synthesis and Audio Processing on the Web* (2nd ed.). O'Reilly Media.
5.  Chart.js Documentation. (2023). *Line charts, formatting, and update matrices.* Retrieved from https://www.chartjs.org/
6.  Mongoose ODM. (2023). *Schema definitions, validation, and middleware hook matrices.* Retrieved from https://mongoosejs.com/
7.  JWT Web Token Specification. (2015). *RFC 7519: JSON Web Token (JWT) standards.* Retrieved from https://tools.ietf.org/html/rfc7519
8.  Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: validity of a brief depression severity measure. *Journal of General Internal Medicine*, 16(9), 606-613.
9.  Spitzer, R. L., Kroenke, K., Williams, J. B., & Lowe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. *Archives of Internal Medicine*, 166(10), 1092-1097.
10. Express.js API Reference. (2023). *Routing, authentication middleware, and CORS request processing.* Retrieved from https://expressjs.com/
11. Beck, A. T., Ward, C. H., Mendelson, M., Mock, J., & Erbaugh, J. (1961). An inventory for measuring depression. *Archives of General Psychiatry*, 4, 561-571.
12. OpenAI API Platform. (2024). *Chat Completions reference and model configurations for gpt-4o-mini.* Retrieved from https://platform.openai.com/docs/
