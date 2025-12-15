import DonutChart from "./DonutChart";


export default function PlatformBreakdown({ data }) {
return (
<DonutChart
title="Learning Platform"
data={data}
/>
);
}