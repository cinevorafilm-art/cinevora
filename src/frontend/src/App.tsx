import Layout from "@/components/Layout";
import AdminPage from "@/pages/AdminPage";
import CategoriesPage from "@/pages/CategoriesPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import MoviesPage from "@/pages/MoviesPage";
import MyListPage from "@/pages/MyListPage";
import PaymentPage from "@/pages/PaymentPage";
import PricingPage from "@/pages/PricingPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from "@/pages/SearchPage";
import SignupPage from "@/pages/SignupPage";
import TvShowsPage from "@/pages/TvShowsPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root route — no layout wrapping (layout added per-route-group)
const rootRoute = createRootRoute({ component: Outlet });

// Layout route — all main pages use this
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

// Auth routes — no layout
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: Outlet,
});

// Admin route — no layout
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// Layout child routes
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
});
const moviesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/movies",
  component: MoviesPage,
});
const tvShowsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/tv-shows",
  component: TvShowsPage,
});
const categoriesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/categories",
  component: CategoriesPage,
});
const myListRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/my-list",
  component: MyListPage,
});
const searchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/search",
  component: SearchPage,
});
const movieDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/movie/$id",
  component: MovieDetailPage,
});
const pricingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/pricing",
  component: PricingPage,
});
const paymentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/payment",
  component: PaymentPage,
});
const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

// Auth child routes
const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/auth/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/auth/signup",
  component: SignupPage,
});
const forgotRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/auth/forgot-password",
  component: ForgotPasswordPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    moviesRoute,
    tvShowsRoute,
    categoriesRoute,
    myListRoute,
    searchRoute,
    movieDetailRoute,
    pricingRoute,
    paymentRoute,
    profileRoute,
  ]),
  authRoute.addChildren([loginRoute, signupRoute, forgotRoute]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
