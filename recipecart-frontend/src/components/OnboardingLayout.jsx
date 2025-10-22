import '../assets/styles/Preferences.css';
import onboardingImage from '../assets/images/onboarding-food.png'; 

function OnboardingLayout({ children }) {
  return (
    <div className="onboarding-layout">
      <div className="onboarding-layout-left">
        <img src={onboardingImage} alt="Fresh ingredients" />
      </div>
      <div className="onboarding-layout-right">
        {children}
      </div>
    </div>
  );
}

export default OnboardingLayout;