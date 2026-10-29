"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { createRequest, reduceRequest, type LeadRequest, type RequestAction } from "./request";
import { loadRequest, saveRequest } from "./storage";

interface State {
  request: LeadRequest;
  /** False until the stored request has been read on the client. */
  ready: boolean;
}

type Action = RequestAction | { type: "hydrate"; request: LeadRequest };

function reducer(state: State, action: Action): State {
  if (action.type === "hydrate") return { request: action.request, ready: true };
  if (!state.ready) return state;
  const request = reduceRequest(state.request, action);
  return request === state.request ? state : { ...state, request };
}

interface LeadContextValue {
  request: LeadRequest;
  ready: boolean;
  dispatch: Dispatch<RequestAction>;
}

const LeadContext = createContext<LeadContextValue | null>(null);

/** Stand-in until the stored request is read on the client; never rendered as content and never saved. */
const PLACEHOLDER: LeadRequest = {
  schemaVersion: 1,
  id: "",
  createdAt: "",
  updatedAt: "",
  spaces: [],
  works: [],
  notes: "",
  urgency: null,
};

export function LeadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { request: PLACEHOLDER, ready: false });

  useEffect(() => {
    dispatch({ type: "hydrate", request: loadRequest() ?? createRequest() });
  }, []);

  useEffect(() => {
    if (state.ready) saveRequest(state.request);
  }, [state]);

  return (
    <LeadContext.Provider value={{ request: state.request, ready: state.ready, dispatch }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLead(): LeadContextValue {
  const value = useContext(LeadContext);
  if (!value) throw new Error("useLead só pode ser usado dentro de <LeadProvider>.");
  return value;
}
