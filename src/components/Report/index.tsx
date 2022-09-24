import type { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { signal } from "@preact/signals";
import { redirect } from "../../utils/redirect";
import { Report, VIEW } from "../../utils/types";
import { useConfig } from "../../utils/useConfig";
import Loading from "../Loading";
import Table from "../Table";

const currentView = signal(VIEW.DAY);

interface OptionViewButtonProps {
    view: VIEW;
}

const OptionViewButton: FunctionalComponent<OptionViewButtonProps> = ({ view }) => {
    return (
        <button onClick={() => {
            currentView.value = view;
        }} className={`w-20 h-20 border-4 bg-white ${view === currentView.value && "border-sky-500"} capitalize`}>
            {view}
        </button>
    )
}

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
                body: JSON.stringify({
                    ...config,
                    view: currentView.value,
                    date: new Date().toISOString()
                }),
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
    }, [config, currentView.value]);

    return (
        <div className="flex flex-col content-center">
            <div className="flex gap-4 justify-center mb-8">
                <OptionViewButton view={VIEW.DAY}/>
                <OptionViewButton view={VIEW.MONTH}/>
            </div>
            {loading ? <Loading /> : <Table reports={reports} />}
        </div>
    )
}

export default ComponentReport