import { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";

import { DataTable } from "@/components/table/data-table";

interface RowData {
  id: string;
  name: string;
}

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];

describe("DataTable", () => {
  it("renders table rows", () => {
    render(
      <DataTable
        columns={columns}
        data={[
          { id: "1", name: "Alpha" },
          { id: "2", name: "Beta" },
        ]}
      />,
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<DataTable columns={columns} data={[]} emptyTitle="Nothing here" />);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
