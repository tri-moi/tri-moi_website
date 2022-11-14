export const DEFAULT_QUERY: string = "http://127.0.0.1:8000/api/";

type IQuery = {
  GET: {
    ALL_USERS: string;
    ONE_USER: string;
    ALL_TYPES: string;
    ALL_HISTORIES: string;
    ONE_TYPE: string;
    ALL_TRASHES: string;
    ONE_TRASH: string;
    ONE_HISTORY: string;
  }
  POST: {
    CREATE_TRASH: string;
    CREATE_TYPE: string;
    CREATE_HISTORY: string;
  },
  PUT: {
    UPDATE_TRASH: string;
    UPDATE_TYPE: string;
    UPDATE_USER: string;
    UPDATE_HISTORY: string;
  },
  DELETE: {
    DELETE_TRASH: string;
    DELETE_TYPE: string;
    DELETE_USER: string;
    DELETE_HISTORY: string;
  },
  AUTH: {
    CHECK_EMAIL: string,
    LOGIN: string,
    REGISTER: string,
  }
}

export const setQuery = (query: any, id?: number | { user?: number, type?: number, trash?: number }): string => {
  switch (query) {
    case QUERY.AUTH.CHECK_EMAIL:
      return `${DEFAULT_QUERY + link.AUTH.CHECK_EMAIL}`;
    case QUERY.AUTH.LOGIN:
      return `${DEFAULT_QUERY + link.AUTH.LOGIN}`;
    case QUERY.AUTH.REGISTER:
      return `${DEFAULT_QUERY + link.AUTH.REGISTER}`;
    case QUERY.GET.ALL_USERS:
      return `${DEFAULT_QUERY + link.GET.ALL_USERS}`;
    case QUERY.GET.ONE_USER:
      return `${DEFAULT_QUERY + link.GET.ONE_USER}/${id}`;
    case QUERY.GET.ALL_TYPES:
      return `${DEFAULT_QUERY + link.GET.ALL_TYPES}`;
    case QUERY.GET.ONE_TYPE:
      return `${DEFAULT_QUERY + link.GET.ONE_TYPE}/${id}`;
    case QUERY.GET.ALL_TRASHES:
      return `${DEFAULT_QUERY + link.GET.ALL_TRASHES}`;
    case QUERY.GET.ONE_TRASH:
      return `${DEFAULT_QUERY + link.GET.ONE_TRASH}/${id}`;
    case QUERY.POST.CREATE_TRASH:
      return `${DEFAULT_QUERY + link.POST.CREATE_TRASH}`;
    case QUERY.POST.CREATE_TYPE:
      return `${DEFAULT_QUERY + link.POST.CREATE_TYPE}`;
    case QUERY.PUT.UPDATE_TRASH:
      return `${DEFAULT_QUERY + link.PUT.UPDATE_TRASH}/${id}?_method=PUT`;
    case QUERY.PUT.UPDATE_TYPE:
      return `${DEFAULT_QUERY + link.PUT.UPDATE_TYPE}/${id}?_method=PUT`;
    case QUERY.PUT.UPDATE_USER:
      return `${DEFAULT_QUERY + link.PUT.UPDATE_USER}/${id}?_method=PUT`;
    case QUERY.DELETE.DELETE_TRASH:
      return `${DEFAULT_QUERY + link.DELETE.DELETE_TRASH}/${id}`;
    case QUERY.DELETE.DELETE_TYPE:
      return `${DEFAULT_QUERY + link.DELETE.DELETE_TYPE}/${id}`;
    case QUERY.DELETE.DELETE_USER:
      return `${DEFAULT_QUERY + link.DELETE.DELETE_USER}/${id}`;
    case QUERY.GET.ALL_HISTORIES:
      const {user, type, trash} = id as { user?: number, type?: number, trash?: number };
      if (user && !type && !trash) {
        return `${DEFAULT_QUERY + link.GET.ALL_HISTORIES}?user=${user}`;
      } else if (type && !user && !trash) {
        return `${DEFAULT_QUERY + link.GET.ALL_HISTORIES}?type=${type}`;
      } else if (trash && !user && !type) {
        return `${DEFAULT_QUERY + link.GET.ALL_HISTORIES}?trash=${trash}`;
      } else if (user && type && !trash) {
        return `${DEFAULT_QUERY + link.GET.ALL_HISTORIES}?user=${user}&type=${type}`;
      } else {
        return `${DEFAULT_QUERY + link.GET.ALL_HISTORIES}`;
      }
    case QUERY.GET.ONE_HISTORY:
      return `${DEFAULT_QUERY + link.GET.ONE_HISTORY}/${id}`;
    case QUERY.POST.CREATE_HISTORY:
      return `${DEFAULT_QUERY + link.POST.CREATE_HISTORY}`;
    case QUERY.PUT.UPDATE_HISTORY:
      return `${DEFAULT_QUERY + link.PUT.UPDATE_HISTORY}/${id}?_method=PUT`;
    case QUERY.DELETE.DELETE_HISTORY:
      return `${DEFAULT_QUERY + link.DELETE.DELETE_HISTORY}/${id}`;

    default:
      return "Query not found";
  }
}

const link: IQuery = {
  GET: {
    ALL_USERS: "users",
    ALL_TYPES: "types",
    ALL_TRASHES: "trashes",
    ALL_HISTORIES: "histories",
    ONE_USER: "users",
    ONE_TYPE: "types",
    ONE_TRASH: "trash",
    ONE_HISTORY: "history",
  },
  POST: {
    CREATE_TRASH: "trash",
    CREATE_TYPE: "type",
    CREATE_HISTORY: "history",
  },
  PUT: {
    UPDATE_TRASH: "trash",
    UPDATE_TYPE: "type",
    UPDATE_USER: "user",
    UPDATE_HISTORY: "history",
  },
  DELETE: {
    DELETE_TRASH: "trash",
    DELETE_TYPE: "type",
    DELETE_USER: "user",
    DELETE_HISTORY: "history",
  },
  AUTH: {
    CHECK_EMAIL: "auth/check-email",
    LOGIN: "auth/login",
    REGISTER: "auth/register",
  }
}

export const QUERY: IQuery = {
  GET: {
    ALL_USERS: "all_users",
    ONE_USER: "one_user",
    ALL_TYPES: "all_types",
    ALL_HISTORIES: "all_histories",
    ONE_TYPE: "one_type",
    ALL_TRASHES: "all_trashes",
    ONE_TRASH: "one_trash",
    ONE_HISTORY: "one_history",
  },
  POST: {
    CREATE_TRASH: "create_trash",
    CREATE_TYPE: "create_type",
    CREATE_HISTORY: "create_history",
  },
  PUT: {
    UPDATE_TRASH: "update_trash",
    UPDATE_TYPE: "update_type",
    UPDATE_USER: "update_user",
    UPDATE_HISTORY: "update_history",
  },
  DELETE: {
    DELETE_TRASH: "delete_trash",
    DELETE_TYPE: "delete_type",
    DELETE_USER: "delete_user",
    DELETE_HISTORY: "delete_history",
  },
  AUTH: {
    CHECK_EMAIL: "check-email",
    LOGIN: "login",
    REGISTER: "register",
  }
}

export default {setQuery}
