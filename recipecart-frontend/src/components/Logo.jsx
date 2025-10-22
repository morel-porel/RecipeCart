
import logo from '../assets/images/logo.svg';

function Logo({ className, isColorful = false }) {
  if (isColorful) {
    // This is the small colorful logo for the form
    return (
      <img src={logo} alt="RecipeCart Logo" className="form-logo" />
    );
  }
  // This is the simple text logo for the header
  return <div className={className}>RecipeCart</div>;
}

export default Logo;