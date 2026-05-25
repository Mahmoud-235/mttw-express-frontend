import { useState } from "react";
import { Plus, Trash2, Cpu, Wifi, WifiOff, Radio } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { devicesAPI, sectorsAPI } from "../services/api";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { timeAgo } from "../utils/helpers";
import toast from "react-hot-toast";

const EMPTY_FORM = { deviceSerial: "", deviceName: "", sectorId: "" };

export default function Devices() {
  const { data, loading, refetch } = useFetch(devicesAPI.getAll);
  const { data: sData } = useFetch(sectorsAPI.getAll);
  const devices = data?.data || [];
  const sectors = sData?.data || [];

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [delId, setDelId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const closeModal = () => {
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const handleCreate = async () => {
    if (!form.deviceSerial.trim()) {
      return toast.error("الرقم التسلسلي مطلوب!");
    }
    if (!form.sectorId) {
      return toast.error("يجب اختيار قطاع!");
    }

    setSaving(true);
    try {
      // ✅ الـ create بس جوه الـ try
      await devicesAPI.create(form);
      toast.success("تم تسجيل الجهاز بنجاح! 🎉");
      closeModal();
    } catch (e) {
      // ✅ لو فشل الـ create فعلاً، هيجي هنا
      toast.error(e.response?.data?.message || "فشل في تسجيل الجهاز");
      setSaving(false);
      return; // ⛔ وقّف هنا، متكملش
    }

    // ✅ الـ refetch برره تماماً عشان لو فشل ميوريش رسالة غلط
    try {
      await refetch();
    } catch {
      // الجهاز اتسجل، بس الـ refetch فشل — مش مشكلة، سيتحدث عند أي action تاني
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await devicesAPI.delete(delId);
      setDelId(null);
      toast.success("تم حذف الجهاز بنجاح");
    } catch (e) {
      toast.error(e.response?.data?.message || "فشل الحذف");
      setDeleting(false);
      return;
    }

    try {
      await refetch();
    } catch {
      // تجاهل فشل الـ refetch
    }

    setDeleting(false);
  };

  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.length - online;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">IoT Devices</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-forest-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse-slow" />
              {online} online
            </span>
            <span className="text-xs text-sage-400">{offline} offline</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} /> Register Device
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Devices",
            value: devices.length,
            icon: Cpu,
            color: "bg-blue-50 text-blue-600 border-blue-100",
          },
          {
            label: "Online",
            value: online,
            icon: Wifi,
            color: "bg-forest-50 text-forest-600 border-forest-100",
          },
          {
            label: "Offline",
            value: offline,
            icon: WifiOff,
            color: "bg-sage-50 text-sage-600 border-sage-200",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${color}`}
            >
              <Icon size={19} />
            </div>
            <div>
              <p className="text-xl font-bold text-sage-900 tabular-nums">
                {value}
              </p>
              <p className="text-xs text-sage-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-forest-100">
          <h3 className="section-title">Registered Devices</h3>
        </div>

        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : devices.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title="No devices registered"
            description="Register your ESP32 IoT nodes to start collecting sensor data."
            action={
              <button className="btn-primary" onClick={() => setModal(true)}>
                <Plus size={14} />
                Register Device
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-forest-100 bg-forest-50/50">
                  {[
                    "Device",
                    "Serial Number",
                    "Status",
                    "Sector",
                    "Last Ping",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 text-left table-header">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {devices.map((d) => (
                  <tr key={d._id} className="table-row">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-forest-50 border border-forest-100 rounded-lg flex items-center justify-center">
                          <Radio size={14} className="text-forest-600" />
                        </div>
                        <span className="text-sm font-medium text-sage-900">
                          {d.deviceName || "Smart Node"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-lg font-mono">
                        {d.deviceSerial}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`badge ${
                          d.status === "online" ? "badge-green" : "badge-gray"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.status === "online"
                              ? "bg-forest-500 animate-pulse"
                              : "bg-sage-400"
                          }`}
                        />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-sage-600">
                      {d.sectorId?.name || d.sectorInfo?.name || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-sage-400">
                      {d.lastPing ? timeAgo(d.lastPing) : "Never"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setDelId(d._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-sage-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Modal */}
      <Modal
        open={modal}
        onClose={closeModal}
        title="Register IoT Device"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Device Serial Number *</label>
            <input
              className="input font-mono"
              placeholder="ECOSENSE-NODE-001"
              value={form.deviceSerial}
              onChange={set("deviceSerial")}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div>
            <label className="label">Device Name (optional)</label>
            <input
              className="input"
              placeholder="North Sector Node"
              value={form.deviceName}
              onChange={set("deviceName")}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div>
            <label className="label">Assign to Sector *</label>
            <select
              className="input"
              value={form.sectorId}
              onChange={set("sectorId")}
            >
              <option value="">— Select sector —</option>
              {sectors.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              className="btn-ghost flex-1 justify-center"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn-primary flex-1 justify-center"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register Device"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Device"
        message="This will permanently delete the device and all its sensor history. This cannot be undone."
      />
    </div>
  );
}
