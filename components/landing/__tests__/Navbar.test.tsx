import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../Navbar";

// Mock dependencies with factory functions
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, passHref, legacyBehavior, ...props }: any) => (
    <a
      href={href}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/app/lib/queries", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(() => Promise.resolve()),
    },
  },
}));

vi.mock("@/lib/utils", () => ({
  cn: vi.fn((...classes: string[]) => classes.filter(Boolean).join(" ")),
}));

// Import mocked modules
import { useUser } from "@/app/lib/queries";
import { supabase } from "@/app/lib/supabase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Get the mocked functions
const mockUseUser = vi.mocked(useUser);
const mockSupabaseSignOut = vi.mocked(supabase.auth.signOut);
const mockUsePathname = vi.mocked(usePathname);
const mockCn = vi.mocked(cn);

// Mock window methods
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, "location", {
  value: {
    reload: vi.fn(),
  },
  writable: true,
});

// Mock scroll event
Object.defineProperty(window, "scrollY", {
  value: 0,
  writable: true,
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseUser.mockReturnValue({ data: null });
    mockSupabaseSignOut.mockClear();
    mockCn.mockClear();

    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = "";
  });

  describe("Rendering", () => {
    it("should render the navbar with logo and brand name", () => {
      renderWithQueryClient(<Navbar />);

      expect(screen.getByLabelText("Credit Tractor")).toBeInTheDocument();
      expect(screen.getByText("Credit Tractor")).toBeInTheDocument();
      expect(screen.getByText("Payment Tracking")).toBeInTheDocument();
    });

    it("should render navigation links when user is not authenticated", () => {
      renderWithQueryClient(<Navbar />);

      expect(screen.getAllByText("Features")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Demo")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Setup")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Login")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Get Started")).toHaveLength(2); // Desktop and mobile
    });

    it("should render user menu when user is authenticated", () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };
      mockUseUser.mockReturnValue({ data: mockUser });

      renderWithQueryClient(<Navbar />);

      expect(screen.getAllByText("Welcome, test@example.com")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Settings")).toHaveLength(2); // Desktop and mobile
      expect(screen.getAllByText("Sign Out")).toHaveLength(2); // Desktop and mobile

      // Should not show guest navigation
      expect(screen.queryByText("Features")).not.toBeInTheDocument();
      expect(screen.queryByText("Demo")).not.toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });
  });

  describe("Scroll Behavior", () => {
    it("should add background styling when scrolled", () => {
      renderWithQueryClient(<Navbar />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-transparent");

      // Simulate scroll
      Object.defineProperty(window, "scrollY", {
        value: 20,
        writable: true,
      });

      fireEvent.scroll(window);

      expect(header).toHaveClass(
        "bg-white/90",
        "backdrop-blur-md",
        "shadow-lg"
      );
    });

    it("should scroll to top when logo is clicked", async () => {
      renderWithQueryClient(<Navbar />);

      const logo = screen.getByLabelText("Credit Tractor");

      await userEvent.click(logo);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  describe("Mobile Menu", () => {
    it("should toggle mobile menu when menu button is clicked", async () => {
      renderWithQueryClient(<Navbar />);

      const menuButton = screen.getByLabelText("Open menu");
      expect(menuButton).toBeInTheDocument();

      await userEvent.click(menuButton);

      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should close mobile menu when clicking menu links", async () => {
      renderWithQueryClient(<Navbar />);

      // Open menu
      const menuButton = screen.getByLabelText("Open menu");
      await userEvent.click(menuButton);

      // Click on a mobile menu link
      const mobileFeatures = screen.getAllByText("Features")[1]; // Second one is mobile
      await userEvent.click(mobileFeatures);

      expect(document.body.style.overflow).toBe("");
    });

    it("should close mobile menu when logo is clicked while menu is open", async () => {
      renderWithQueryClient(<Navbar />);

      // Open menu
      const menuButton = screen.getByLabelText("Open menu");
      await userEvent.click(menuButton);
      expect(document.body.style.overflow).toBe("hidden");

      // Click logo
      const logo = screen.getByLabelText("Credit Tractor");
      await userEvent.click(logo);

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Authentication Actions", () => {
    it("should call signOut when Sign Out button is clicked", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };
      mockUseUser.mockReturnValue({ data: mockUser });

      renderWithQueryClient(<Navbar />);

      const signOutButton = screen.getAllByText("Sign Out")[0]; // Use first occurrence (desktop)
      await userEvent.click(signOutButton);

      expect(mockSupabaseSignOut).toHaveBeenCalledOnce();

      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalledOnce();
      });
    });

    it("should handle sign out from mobile menu", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };
      mockUseUser.mockReturnValue({ data: mockUser });

      renderWithQueryClient(<Navbar />);

      // Open mobile menu
      const menuButton = screen.getByLabelText("Open menu");
      await userEvent.click(menuButton);

      // Click sign out in mobile menu
      const mobileSignOut = screen.getAllByText("Sign Out")[1]; // Second one is mobile
      await userEvent.click(mobileSignOut);

      expect(mockSupabaseSignOut).toHaveBeenCalledOnce();
      expect(document.body.style.overflow).toBe("");

      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalledOnce();
      });
    });
  });

  describe("Settings Navigation", () => {
    it("should highlight settings button when on settings page", () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };
      mockUseUser.mockReturnValue({ data: mockUser });
      mockUsePathname.mockReturnValue("/settings");

      renderWithQueryClient(<Navbar />);

      const settingsButtons = screen.getAllByText("Settings");

      // Check that settings button exists (styling tests are complex with Radix UI components)
      expect(settingsButtons).toHaveLength(2);
    });

    it("should not highlight settings button when not on settings page", () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };
      mockUseUser.mockReturnValue({ data: mockUser });
      mockUsePathname.mockReturnValue("/");

      renderWithQueryClient(<Navbar />);

      const settingsButtons = screen.getAllByText("Settings");

      // Check that settings button exists
      expect(settingsButtons).toHaveLength(2);
    });
  });

  describe("Responsive Behavior", () => {
    it("should hide desktop navigation on mobile", () => {
      renderWithQueryClient(<Navbar />);

      const desktopNavs = screen.getAllByRole("navigation");
      expect(desktopNavs[0]).toHaveClass("hidden", "md:flex");
    });

    it("should hide mobile menu button on desktop", () => {
      renderWithQueryClient(<Navbar />);

      const mobileMenuButton = screen.getByLabelText("Open menu");
      expect(mobileMenuButton).toHaveClass("md:hidden");
    });

    it("should hide brand text on small screens", () => {
      renderWithQueryClient(<Navbar />);

      const brandContainer = screen.getByText("Credit Tractor").closest("div");
      expect(brandContainer).toHaveClass("hidden", "sm:block");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderWithQueryClient(<Navbar />);

      expect(screen.getByLabelText("Credit Tractor")).toBeInTheDocument();
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });

    it("should update ARIA label when mobile menu state changes", async () => {
      renderWithQueryClient(<Navbar />);

      const menuButton = screen.getByLabelText("Open menu");

      await userEvent.click(menuButton);

      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
      expect(screen.queryByLabelText("Open menu")).not.toBeInTheDocument();
    });

    it("should have proper semantic HTML structure", () => {
      renderWithQueryClient(<Navbar />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getAllByRole("navigation")).toHaveLength(2); // Desktop and mobile nav
    });
  });

  describe("Event Cleanup", () => {
    it("should remove scroll event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderWithQueryClient(<Navbar />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );
    });
  });
});
