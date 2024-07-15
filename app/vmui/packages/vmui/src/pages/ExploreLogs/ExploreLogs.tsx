import React, { FC, useCallback, useEffect, useState } from "preact/compat";
import ExploreLogsBody from "./ExploreLogsBody/ExploreLogsBody";
import useStateSearchParams from "../../hooks/useStateSearchParams";
import useSearchParamsFromObject from "../../hooks/useSearchParamsFromObject";
import { useFetchLogs } from "./hooks/useFetchLogs";
import { useAppState } from "../../state/common/StateContext";
import Spinner from "../../components/Main/Spinner/Spinner";
import Alert from "../../components/Main/Alert/Alert";
import ExploreLogsHeader from "./ExploreLogsHeader/ExploreLogsHeader";
import "./style.scss";
import { ErrorTypes, TimeParams } from "../../types";
import { useTimeState } from "../../state/time/TimeStateContext";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import ExploreLogsBarChart from "./ExploreLogsBarChart/ExploreLogsBarChart";
import { useFetchLogHits } from "./hooks/useFetchLogHits";
import { LOGS_ENTRIES_LIMIT } from "../../constants/logs";
import { getTimeperiodForDuration, relativeTimeOptions } from "../../utils/time";

const storageLimit = Number(getFromStorage("LOGS_LIMIT"));
const defaultLimit = isNaN(storageLimit) ? LOGS_ENTRIES_LIMIT : storageLimit;

const ExploreLogs: FC = () => {
  const { serverUrl } = useAppState();
  const { duration, relativeTime, period: periodState } = useTimeState();
  const { setSearchParamsFromKeys } = useSearchParamsFromObject();

  const [limit, setLimit] = useStateSearchParams(defaultLimit, "limit");
  const [query, setQuery] = useStateSearchParams("*", "query");
  const [tmpQuery, setTmpQuery] = useState("");
  const [period, setPeriod] = useState<TimeParams>(periodState);
  const [queryError, setQueryError] = useState<ErrorTypes | string>("");
  const [markdownParsing, setMarkdownParsing] = useState(getFromStorage("LOGS_MARKDOWN") === "true");

  const { logs, isLoading, error, fetchLogs } = useFetchLogs(serverUrl, query, limit);
  const { fetchLogHits, ...dataLogHits } = useFetchLogHits(serverUrl, query);

  const getPeriod = useCallback(() => {
    const relativeTimeOpts = relativeTimeOptions.find(d => d.id === relativeTime);
    if (!relativeTimeOpts) return periodState;
    const { duration, until } = relativeTimeOpts;
    return getTimeperiodForDuration(duration, until());
  }, [periodState, relativeTime]);

  const handleRunQuery = () => {
    if (!query) {
      setQueryError(ErrorTypes.validQuery);
      return;
    }
    setQueryError("");

    const newPeriod = getPeriod();
    setPeriod(newPeriod);
    fetchLogs(newPeriod);
    fetchLogHits(newPeriod);

    setSearchParamsFromKeys( {
      query,
      "g0.range_input": duration,
      "g0.end_input": newPeriod.date,
      "g0.relative_time": relativeTime || "none",
    });
  };

  const handleChangeLimit = (limit: number) => {
    setLimit(limit);
    setSearchParamsFromKeys({ limit });
    saveToStorage("LOGS_LIMIT", `${limit}`);
  };

  const handleChangeMarkdownParsing = (val: boolean) => {
    saveToStorage("LOGS_MARKDOWN", `${val}`);
    setMarkdownParsing(val);
  };

  const handleApplyFilter = (val: string) => {
    setQuery(prev => `_stream: ${val === "other" ? "{}" : val} AND (${prev})`);
  };

  const handleUpdateQuery = () => {
    setQuery(tmpQuery);
    handleRunQuery();
  };

  useEffect(() => {
    if (query) handleRunQuery();
  }, [periodState]);

  useEffect(() => {
    handleRunQuery();
    setTmpQuery(query);
  }, [query]);

  return (
    <div className="vm-explore-logs">
      <ExploreLogsHeader
        query={tmpQuery}
        error={queryError}
        limit={limit}
        markdownParsing={markdownParsing}
        onChange={setTmpQuery}
        onChangeLimit={handleChangeLimit}
        onRun={handleUpdateQuery}
        onChangeMarkdownParsing={handleChangeMarkdownParsing}
      />
      {isLoading && <Spinner />}
      {error && <Alert variant="error">{error}</Alert>}
      {!error && (
        <ExploreLogsBarChart
          {...dataLogHits}
          query={query}
          period={period}
          isLoading={isLoading ? false : dataLogHits.isLoading}
          onApplyFilter={handleApplyFilter}
        />
      )}
      <ExploreLogsBody
        data={logs}
        markdownParsing={markdownParsing}
      />
    </div>
  );
};

export default ExploreLogs;
