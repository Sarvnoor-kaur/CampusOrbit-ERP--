const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'App.jsx');

console.log('Reading file:', filePath);
let content = fs.readFileSync(filePath, 'utf8');

console.log('Applying fixes...');

// Fix 1: Change true to false
content = content.replace(
    "user.role === 'student' && user.applicationSubmitted === true",
    "user.role === 'student' && user.applicationSubmitted === false"
);

// Fix 2: Add routes
content = content.replace(
    `      ) : user.role === 'student' && user.applicationSubmitted === false ? (
        <Routes>
          <Route path="/application-form" element={<ApplicationFormPage user={user} />} />
          <Route path="/logout" element={<Navigate to="/" />} />`,
    `      ) : user.role === 'student' && user.applicationSubmitted === false ? (
        <Routes>
          <Route path="/" element={<ModernLandingPage />} />
          <Route path="/application-form" element={<ApplicationFormPage user={user} />} />
          <Route path="/register" element={<StudentRegister setUser={setUser} />} />
          <Route path="/logout" element={<Navigate to="/" />} />`
);

// Fix 3: Add user removal in verifyToken
const oldVerify = `      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);`;

const newVerify = `      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);`;

content = content.replace(oldVerify, newVerify);

// Fix 4: Add user removal in handleLogout
content = content.replace(
    `  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };`,
    `  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ App.jsx fixed successfully!');
console.log('Changes made:');
console.log('1. Changed applicationSubmitted === true to false');
console.log('2. Added home page and register routes for pending applications');
console.log('3. Added localStorage.removeItem("user") cleanup');
