# Octanet Task Manager

A modern, responsive Task Management application built with React, TypeScript, Vite, and Supabase. This application features secure user authentication and a Kanban-style board for managing tasks efficiently.

## Features

- **User Authentication**: Secure Login and Registration using Supabase Auth.
- **Protected Routes**: Dashboard access is restricted to authenticated users.
- **Task Management**:
  - **Create**: Add new tasks with ease.
  - **Read**: View all tasks in a structured layout.
  - **Update**: Edit task details or change status (Drag & Drop supported).
  - **Delete**: Remove tasks from the board.
- **Responsive Design**: Built with Tailwind CSS for valid display across devices.
- **Real-time**: Data persistence powered by Supabase.

## Tech Stack

- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/)
- **DnD**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

## Prerequisites

Before running this project locally, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1.  Create a new project on [Supabase](https://supabase.com/).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Run the contents of `supabase_schema.sql` (found in the root directory) to create the necessary tables.
4.  Run the contents of `fix_rls.sql` to apply Row Level Security (RLS) policies for secure data access.

### 4. Configure Environment Variables

Create a `.env` file in the root directory (or rename `example.env` if available) and add your Supabase credentials. These can be found in your Supabase Project Settings -> API.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Project Structure

```
p Task2
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (useAuth, useTasks)
│   ├── pages/           # Application pages (Login, Register, TaskBoard)
│   ├── routes/          # Route definitions and protection logic
│   ├── types/           # TypeScript interface definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
