import { supabase } from '@/lib/supabase';

export default async function ProjectsPage() {
  // Fetch projects and join with users table
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      users:musical_director_id (id, role)
    `);

  // Handle errors
  if (error) {
    console.error('Error fetching projects:', error.message);
    return (
      <div>
        <h1>Projects Page</h1>
        <p>Error loading projects: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Projects Page</h1>
      <p>Welcome to the projects section!</p>
      <h2>Projects List</h2>
      {projects.length === 0 ? (
        <p>No projects found. Add some data in Supabase!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              {project.name} - Department: {project.department} 
              {project.users && project.users.role 
                ? ` (Musical Director Role: ${project.users.role})` 
                : ' (No Musical Director Assigned)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}