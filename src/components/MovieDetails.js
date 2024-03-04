export const MovieDetails = ({ selectedId, onHandleCloseMovie }) => (
  <div className="box">
    <div className="details">
      <button onClick={onHandleCloseMovie} className="btn-back">
        &larr;
      </button>
      {selectedId}
    </div>
  </div>
);

