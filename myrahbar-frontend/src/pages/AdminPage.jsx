                          }))
                        }
                        className="rounded"
                      />
                      Hostel Available
                    </label>
                  </div>
                  {uniForm.hostelAvailable && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Hostel Fee/month (PKR)
                        </label>
                        <input
                          type="number"
                          value={uniForm.hostelFee}
                          onChange={(e) =>
                            setUniForm((p) => ({
                              ...p,
                              hostelFee: e.target.value,
                            }))
                          }
                          placeholder="e.g. 5000"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Mess Fee/month (PKR)
                        </label>
                        <input
                          type="number"
                          value={uniForm.mes
<truncated 17316 bytes>
          {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(b.status)}
                      <span className="text-xs text-slate-500">{b.slot}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {b.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {b.email} Â· {b.whatsapp}
                    </p>
                    <p className="text-xs text-slate-500">Topic: {b.topic}</p>
                    {b.message && (
                      <p className="text-xs text-slate-400 mt-1 italic">
                        "{b.message}"
                      </p>
                    )}
                  </div>
                  <a
                    href={"https://wa.me/" + b.whatsapp.replace(/\D/g, "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white px-3 py-1.5 rounded-lg shrink-0"
                    style={{ background: "#25D366" }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
