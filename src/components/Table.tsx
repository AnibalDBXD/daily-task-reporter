import { useState, useEffect } from "preact/hooks"
import type { JSXInternal } from "preact/src/jsx";
import { redirect } from "../utils/redirect";
import type { Report } from "../utils/types";
import { useConfig } from "../utils/useConfig";

const Table = () => {
	const [rows, setRows] = useState<JSXInternal.Element[]>([]);
	const [config] = useConfig();

	useEffect(() => {
		if (!config.githubAuthToken || !config.owner || !config.repos) {
			redirect("/form");
			return;
		}

		const fetchData = async () => {
			const reports: Report[] | { error: string } = await (await fetch("/getReport", {
				body: JSON.stringify(config),
				method: "POST",
			})).json();
			if ("error" in reports) {
				alert(reports.error);
				redirect("/form");
				return;
			}
			const newRows = reports.map(({ title, issuesUrls, pullRequestUrl, repo, updated_at }: Report) => (
				<tr>
					<td>{repo}</td>
					<td>{updated_at}</td>
					<td>{title}</td>
					<td>
						<a href={issuesUrls[0]}>{issuesUrls[0]}</a>
					</td>
					<td>0</td>
					<td>
						<a href={pullRequestUrl}>{pullRequestUrl}</a>
					</td>
					<td>DONE</td>
					<td>PENDING</td>
				</tr>
			));
			setRows(newRows);
		};

		fetchData();
	}, [config]);

	return (
		<table className="table-auto w-full font-sans bg-white" style={{ fontSize: '13px' }}>
			<thead>
				<tr>
					<th>Project</th>
					<th>Day</th>
					<th>Short Name</th>
					<th>Issue Link</th>
					<th>Hours</th>
					<th>PR LINK</th>
					<th>Status</th>
					<th>Payment STATUS</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}

export default Table