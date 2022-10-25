import {
  ProjectsActions,
  PROJECTS_LOADED,
  PROJECTS_LOADING,
  PROJECTS_UNLOADED,
  PROJECT_APPLICATIONS_ERROR,
  PROJECT_APPLICATIONS_LOADED,
  PROJECT_APPLICATIONS_LOADING,
  PROJECT_APPLICATIONS_NOT_FOUND,
} from "../actions/projects";
import { ProjectEventsMap } from "../types";

export enum Status {
  Undefined = 0,
  Loading,
  Loaded,
  Error,
}

export enum AppStatus {
  Accepted,
  Rejected,
  Pending,
  NotFound,
  Unknown,
}

export interface ProjectsState {
  status: Status;
  error: string | undefined;
  ids: number[];
  events: ProjectEventsMap;
  applications: [
    {
      projectId: string;
      round: {
        id: string;
      };
      status: AppStatus;
    }
  ];
}

const initialState: ProjectsState = {
  status: Status.Undefined,
  error: undefined,
  ids: [],
  events: {},
  applications: [
    {
      projectId: "",
      round: {
        id: "",
      },
      status: AppStatus.Unknown,
    },
  ],
};

export const projectsReducer = (
  state: ProjectsState = initialState,
  action: ProjectsActions
): ProjectsState => {
  switch (action.type) {
    case PROJECTS_LOADING: {
      return {
        ...state,
        status: Status.Loading,
        ids: [],
      };
    }

    case PROJECTS_LOADED: {
      const { events } = action;
      const ids = Object.keys(events).map((id) => Number(id));

      return {
        ...state,
        status: Status.Loaded,
        ids,
        events,
      };
    }

    case PROJECTS_UNLOADED: {
      return {
        ...state,
        status: Status.Undefined,
        ids: [],
        events: {},
      };
    }

    case PROJECT_APPLICATIONS_LOADING: {
      // const { projectID, roundID } = action;
      return {
        ...state,
        applications: state.applications,
        error: undefined,
        status: Status.Loading,
      };
    }

    case PROJECT_APPLICATIONS_NOT_FOUND: {
      const { projectID, roundID } = action;
      return {
        ...state,
        applications: [
          {
            projectId: projectID,
            round: {
              id: roundID,
            },
            status: AppStatus.NotFound,
          },
        ],
        error: undefined,
        status: Status.Loaded,
      };
    }

    case PROJECT_APPLICATIONS_LOADED: {
      const {
        projectID,
        applications,
      }: {
        projectID: string;
        applications: any;
      } = action;
      console.log("applications", projectID, applications);
      return {
        ...state,
        applications,
        error: undefined,
        status: Status.Loaded,
      };
    }

    case PROJECT_APPLICATIONS_ERROR: {
      const { error } = action;
      return {
        ...state,
        applications: state.applications,
        error,
        status: Status.Error,
      };
    }

    default: {
      return state;
    }
  }
};
