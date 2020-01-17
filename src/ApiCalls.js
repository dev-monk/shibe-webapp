const apiUrl = 'http://localhost:8000/api';
export const preloadCount = 12;

export const fetchUuid = async (onResult) =>
{
    fetch (`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{}"
    })
    .then (res => res.json ())
    .then (res => onResult (res.id))
    .catch (console.log);
};

export const fetchImages = async (onResult) => {
  fetch (`${apiUrl}/shibes/random/${preloadCount}`)
  .then (res => res.json ())
  .then (res => onResult (res.urls))
  .catch(console.log);
}

export const fetchFavourites = async (uuid, pageNo, onResult) => {
  fetch (`${apiUrl}/shibes?user=${uuid}&itemsPerPage=${preloadCount}&page=${pageNo}`)
  .then (res => res.json ())
  .then (res => onResult (res))
  .catch(console.log);
};

export const markFavourite = async (uuid, url) => {
  fetch (`${apiUrl}/shibes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify ({
      user: `/api/users/${uuid}`,
      url: url
    })
  })
  .catch (console.log);
}

export const deleteShibe = async (shibeId) => {
  fetch (`${apiUrl}/shibes/${shibeId}`, { method: 'DELETE' })
  .catch (console.log);
};
