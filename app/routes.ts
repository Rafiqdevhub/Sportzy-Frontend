import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("matches", "routes/matches.tsx"),
  route("matches/:id", "routes/matches.$id.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
