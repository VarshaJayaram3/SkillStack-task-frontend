import DonutChart from "./DonutChart";

export default function ResourceBreakdown({ data }) {
return (
<DonutChart
title="Learning Resource Type"
data={data}
/>
);
}