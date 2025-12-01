import os
os.chdir(r'c:\Users\sarvn\OneDrive\Desktop\ums\frontend\src')

with open('App.jsx', 'r') as f:
    content = f.read()

# Fix 1: Change true to false
content = content.replace(
    "user.role === 'student' && user.applicationSubmitted === true",
    "user.role === 'student' && user.applicationSubmitted === false"
)

# Fix 2: Add routes
content = content.replace(
    """      ) : user.role === 'student' && user.applicationSubmitted === false ? (
        <Routes>
          <Route path="/application-form" element={<ApplicationFormPage user={user} />} />
          <Route path="/logout" element={<Navigate to="/" />} />""",
    """      ) : user.role === 'student' && user.applicationSubmitted === false ? (
        <Routes>
          <Route path="/" element={<ModernLandingPage />} />
          <Route path="/application-form" element={<ApplicationFormPage user={user} />} />
          <Route path="/register" element={<StudentRegister setUser={setUser} />} />
          <Route path="/logout" element={<Navigate to="/" />} />"""
)

# Fix 3: Add user removal in verifyToken
old_verify = """      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);"""

new_verify = """      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);"""

content = content.replace(old_verify, new_verify)

# Fix 4: Add user removal in handleLogout
content = content.replace(
    """  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };""",
    """  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };"""
)

with open('App.jsx', 'w') as f:
    f.write(content)

print('✅ App.jsx fixed successfully!')
