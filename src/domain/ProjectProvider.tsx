"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { createProject, reduceProject, type Project, type ProjectAction } from "./project";
import { loadProject, saveProject } from "./storage";

interface State {
  project: Project;
  /** False until the stored project has been read on the client. */
  ready: boolean;
}

type Action = ProjectAction | { type: "hydrate"; project: Project };

function reducer(state: State, action: Action): State {
  if (action.type === "hydrate") return { project: action.project, ready: true };
  if (!state.ready) return state;
  const project = reduceProject(state.project, action);
  return project === state.project ? state : { ...state, project };
}

interface ProjectContextValue {
  project: Project;
  ready: boolean;
  dispatch: Dispatch<ProjectAction>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

/** Stand-in until the stored project is read on the client; never rendered as content and never saved. */
const PLACEHOLDER: Project = {
  schemaVersion: 1,
  id: "",
  createdAt: "",
  updatedAt: "",
  rooms: [],
  projectWorks: [],
  context: { location: "", propertyType: "", occupied: "", timeline: "", access: "" },
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { project: PLACEHOLDER, ready: false });

  useEffect(() => {
    dispatch({ type: "hydrate", project: loadProject() ?? createProject() });
  }, []);

  useEffect(() => {
    if (state.ready) saveProject(state.project);
  }, [state]);

  return (
    <ProjectContext.Provider value={{ project: state.project, ready: state.ready, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const value = useContext(ProjectContext);
  if (!value) throw new Error("useProject só pode ser usado dentro de <ProjectProvider>.");
  return value;
}
