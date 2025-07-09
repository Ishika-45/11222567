export const logAction = (action, payload) => {
    const logs = JSON.parse(localStorage.getItem("logs") || "[]");
    logs.push({
      timestamp: new Date().toISOString(),
      action,
      payload,
    });
    localStorage.setItem("logs", JSON.stringify(logs));
  };