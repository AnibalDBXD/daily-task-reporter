import { useEffect, useState } from "preact/hooks";
import { redirect } from "../../utils/redirect";
import type { Report } from "../../utils/types";
import { useConfig } from "../../utils/useConfig";
import Loading from "../Loading";
import Table from "../Table";

const ComponentReport = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);

    const [config] = useConfig();

    useEffect(() => {
        if (!config.githubAuthToken || !config.owner || !config.repos) {
            redirect("/form");
            return;
        }
        setLoading(true);

        const fetchData = async () => {
            const newReports: Report[] | { error: string } = await (await fetch("/getReport", {
                body: JSON.stringify(config),
                method: "POST",
            })).json();
            if ("error" in newReports) {
                alert(newReports.error);
                redirect("/form");
                return;
            }

            setReports(newReports);
            setLoading(false);
        };

        fetchData();
    }, [config]);

    if (loading) {
        return <Loading />
    }

    return (
        <Table reports={reports} />
    )
}

export default ComponentReport