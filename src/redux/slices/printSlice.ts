import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrintRow {
  [key: string]: string | number | boolean | null | undefined;
}

interface PrintState {
  dataToPrint: PrintRow[];
}

const initialState: PrintState = {
  dataToPrint: [],
};

const printSlice = createSlice({
  name: "print",
  initialState,
  reducers: {
    setDataToPrint: (state, action: PayloadAction<PrintRow[]>) => {
      state.dataToPrint = action.payload;
    },
    printData: (state) => {
      const data = state.dataToPrint;
      if (!data.length) return;

      const keys = Object.keys(data[0]);
      const headers = keys.map((k) => `<th>${k}</th>`).join("");

      const rows = data
        .map(
          (item) => `
        <tr>
          ${keys.map((key) => `<td>${item[key]}</td>`).join("")}
        </tr>`
        )
        .join("");

      const html = `
        <html>
        <head><title>Print</title></head>
        <body>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
        </html>`;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }
    },
  },
});

export const { setDataToPrint, printData } = printSlice.actions;
export default printSlice.reducer;
