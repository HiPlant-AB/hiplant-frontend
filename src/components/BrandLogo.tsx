export function BrandLogo() {
  return (
    <div className="brand-logo">
      <span className="brand-logo__mark" aria-hidden="true">
        <img
          src="/plant-guardian.png"
          alt=""
          className="brand-logo__image"
        />
      </span>

      <div className="brand-logo__text">
        <p className="brand-logo__name">HiPlant</p>
        <p className="brand-logo__subtitle">Plant Care</p>
      </div>
    </div>
  );
}