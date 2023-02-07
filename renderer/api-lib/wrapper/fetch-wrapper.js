export const fetcher = async (params) => {
    const [url, options] = params;
    const res = await fetch(url, options);
    let payload;
    try {
      if (res.status === 204)
        return null; // 204 does not have body
      payload = await res.json();
    } catch (e) {
    }
    if (res.ok) {
      return payload;
    } else {
      return Promise.reject(payload.error || new Error('Something went wrong'));
    }
};
  