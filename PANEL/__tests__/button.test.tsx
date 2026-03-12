import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button>Save</Button>);

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<Button loading>Saving</Button>);

    const button = screen.getByRole("button", {
      name: "Saving",
    });

    expect(button).toBeDisabled();
  });
});
