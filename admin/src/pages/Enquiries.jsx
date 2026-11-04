import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageSquareText, Save } from "lucide-react";
import { toast } from "sonner";
import apiClient from "../services/apiClient";
import { formatDate } from "../lib/utils";

const ENQUIRY_STATUSES = ["New", "Contacted", "Site visit", "Closed", "Not interested"];

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/admin/enquiries");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch enquiries.");
      }

      setEnquiries(data.enquiries);
      setDrafts(Object.fromEntries(data.enquiries.map((enquiry) => [
        enquiry._id,
        { status: enquiry.status || "New", notes: enquiry.notes || "" },
      ])));
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const sources = useMemo(
    () => [...new Set(enquiries.map((enquiry) => enquiry.utm_source || "direct"))].sort(),
    [enquiries],
  );
  const filteredEnquiries = enquiries.filter((enquiry) => (
    (statusFilter === "all" || (enquiry.status || "New") === statusFilter)
    && (sourceFilter === "all" || (enquiry.utm_source || "direct") === sourceFilter)
    && (typeFilter === "all" || (enquiry.type || "Buyer") === typeFilter)
  ));

  const updateDraft = (id, field, value) => {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], [field]: value },
    }));
  };

  const saveEnquiry = async (id) => {
    try {
      setSavingId(id);
      const { data } = await apiClient.put(`/api/admin/enquiries/${id}`, drafts[id]);
      if (!data.success) {
        throw new Error(data.message || "Failed to update enquiry.");
      }

      setEnquiries((current) => current.map((enquiry) => (
        enquiry._id === id ? data.enquiry : enquiry
      )));
      toast.success("Enquiry updated.");
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update enquiry.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] px-4 pb-12 pt-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4755B]/10 text-[#D4755B]">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-[#1C1B1A]">Enquiries</h1>
          </div>
          <p className="text-[#5A5856]">Review buyer and owner enquiries and track follow-ups.</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E6D5C3] bg-white p-4 shadow-card sm:flex-row">
          <label className="flex-1 text-sm font-medium text-[#5A5856]">
            Enquiry type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-[#E6D5C3] bg-[#FAF8F4] px-3 py-2.5 text-[#1C1B1A] outline-none focus:border-[#D4755B]"
            >
              <option value="all">All enquiries</option>
              <option value="Buyer">Buyer enquiries</option>
              <option value="Owner">Owner enquiries</option>
            </select>
          </label>
          <label className="flex-1 text-sm font-medium text-[#5A5856]">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-[#E6D5C3] bg-[#FAF8F4] px-3 py-2.5 text-[#1C1B1A] outline-none focus:border-[#D4755B]"
            >
              <option value="all">All statuses</option>
              {ENQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="flex-1 text-sm font-medium text-[#5A5856]">
            Source
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-[#E6D5C3] bg-[#FAF8F4] px-3 py-2.5 text-[#1C1B1A] outline-none focus:border-[#D4755B]"
            >
              <option value="all">All sources</option>
              {sources.map((source) => <option key={source} value={source}>{source}</option>)}
            </select>
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6D5C3] bg-white shadow-card">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[#5A5856]">
              <Loader2 className="h-5 w-5 animate-spin text-[#D4755B]" />
              Loading enquiries...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <p className="py-16 text-center text-[#5A5856]">No enquiries match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-[#1C1B1A]">
                    {["Type", "Date", "Name", "Phone", "Email", "Property details", "Message", "Source", "Status", "Notes", ""].map((heading, index) => (
                      <th key={`${heading}-${index}`} className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F1E8]">
                  {filteredEnquiries.map((enquiry) => {
                    const propertyId = enquiry.propertyId?._id || enquiry.propertyId;
                    const draft = drafts[enquiry._id] || { status: "New", notes: "" };
                    return (
                      <tr key={enquiry._id} className="align-top transition-colors hover:bg-[#FAF8F4]">
                        <td className="px-4 py-4 text-sm">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${enquiry.type === "Owner" ? "bg-[#FCE9E2] text-[#A9472E]" : "bg-[#F5F1E8] text-[#5A5856]"}`}>
                            {enquiry.type || "Buyer"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#5A5856]">{formatDate(enquiry.createdAt)}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-[#1C1B1A]">{enquiry.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          <a className="font-medium text-[#B85E45] hover:underline" href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {enquiry.email ? <a className="text-[#B85E45] hover:underline" href={`mailto:${enquiry.email}`}>{enquiry.email}</a> : <span className="text-[#9B9B99]">—</span>}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {propertyId ? (
                            <Link className="font-medium text-[#B85E45] hover:underline" to={`/update/${propertyId}`}>
                              {enquiry.propertyId?.title || "View property"}
                            </Link>
                          ) : enquiry.type === "Owner" ? (
                            <div className="space-y-1 text-[#5A5856]">
                              <p>{enquiry.propertyType || "Property type not provided"}</p>
                              <p>{enquiry.locality || "Locality not provided"}</p>
                              <p>{enquiry.purpose || "Purpose not provided"}</p>
                              {enquiry.expectedPrice != null && <p>₹{Number(enquiry.expectedPrice).toLocaleString("en-IN")}</p>}
                            </div>
                          ) : <span className="text-[#9B9B99]">Unavailable</span>}
                        </td>
                        <td className="max-w-xs whitespace-pre-wrap px-4 py-4 text-sm text-[#5A5856]">{enquiry.question || "—"}</td>
                        <td className="px-4 py-4 text-sm text-[#5A5856]">{enquiry.utm_source || "direct"}</td>
                        <td className="min-w-40 px-4 py-4">
                          <select
                            aria-label={`Status for ${enquiry.name}`}
                            value={draft.status}
                            onChange={(event) => updateDraft(enquiry._id, "status", event.target.value)}
                            className="w-full rounded-lg border border-[#E6D5C3] bg-white px-2.5 py-2 text-sm text-[#1C1B1A] outline-none focus:border-[#D4755B]"
                          >
                            {ENQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </td>
                        <td className="min-w-56 px-4 py-4">
                          <textarea
                            aria-label={`Notes for ${enquiry.name}`}
                            value={draft.notes}
                            onChange={(event) => updateDraft(enquiry._id, "notes", event.target.value)}
                            rows={2}
                            className="w-full resize-y rounded-lg border border-[#E6D5C3] px-2.5 py-2 text-sm outline-none focus:border-[#D4755B]"
                            placeholder="Add follow-up notes"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => saveEnquiry(enquiry._id)}
                            disabled={savingId === enquiry._id}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#D4755B] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B86851] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {savingId === enquiry._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
