// // components/GanttChart.tsx
// "use client";
// import { useEffect, useRef } from "react";
// import Gantt from "frappe-gantt";
// import "frappe-gantt/dist/frappe-gantt.css";

// interface Task {
//   id: string;
//   name: string;
//   start: string;
//   end: string;
//   progress: number;
//   dependencies?: string;
// }

// interface GanttChartProps {
//   tasks: Task[];
// }

// const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
//   const ganttRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (ganttRef.current) {
//       new Gantt(ganttRef.current, tasks, {
//         view_mode: "Day",
//         language: "en",
//       });
//     }
//   }, [tasks]);

//   return <div ref={ganttRef}></div>;
// };

// export default GanttChart;
