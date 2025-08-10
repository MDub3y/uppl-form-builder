# upliance.ai React + Redux Form Builder

**India's first AI cooking assistant form builder — built with React, TypeScript, MUI, and Redux.**

---

## About upliance.ai

upliance.ai has built India’s first AI cooking assistant designed for beginners. We simplify and automate all parts of cooking, aiming to push the boundaries of what home appliances can do for young India. As a disruptive startup, we leverage AI and collaborate closely with industry leaders like OpenAI to build innovative hardware products with everyday utility.

---

## Project Overview

This project is a **dynamic form builder** assignment to be completed within 48 hours.

---

## Features

### 1. Dynamic Form Builder (/create)
- Add new fields of various types:
  - Text, Number, Textarea, Select, Radio, Checkbox, Date
- Configure each field with:
  - Label, Required toggle, Default value
  - Validation rules:
    - Not empty, Min/Max length, Email format, Custom password rule
- Mark fields as **Derived Fields**:
  - Compute values based on one or more parent fields with custom formulas
- Reorder fields via drag-and-drop and delete fields
- Save form schema with a custom form name to **localStorage**

### 2. Form Preview (/preview)
- Render the built form as an end user would see it
- Support user input and show real-time validations and errors
- Auto-update derived fields as parent fields change

### 3. My Forms (/myforms)
- Display a list of saved forms from localStorage
- Show form name and date of creation
- Clicking a form opens the form preview page

---

## Tech Stack

- **React** with TypeScript  
- **Redux Toolkit** for state management  
- **Material UI (MUI)** for UI components  
- **@dnd-kit** for drag-and-drop sorting  
- **localStorage** for persistence (no backend)

---

## Installation & Running Locally

```bash
git clone https://github.com/your-username/upliance-form-builder.git
cd upliance-form-builder
npm install
npm start
```
