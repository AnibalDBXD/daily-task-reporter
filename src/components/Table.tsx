import type { FunctionComponent } from "preact";
import type { Report } from "../utils/types";

interface TableProps {
	reports: Report[]
}

const Table: FunctionComponent<TableProps> = ({ reports }) => {
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
				{reports.map(({ title, issuesUrls, pullRequestUrl, repo, updated_at }: Report) => (
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
			))}
			</tbody>
		</table>
	)
}

export default Table