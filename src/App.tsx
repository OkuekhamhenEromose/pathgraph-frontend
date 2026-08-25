import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./pages/HomePage";
import { RolesPage } from "./pages/RolesPage";
import { RoleDetailPage } from "./pages/RoleDetailPage";
import { SkillsPage } from "./pages/SkillsPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";
import { TracksPage } from "./pages/TracksPage";
import { TrackDetailPage } from "./pages/TrackDetailPage";
import { PeoplePage } from "./pages/PeoplePage";
import { PersonDetailPage } from "./pages/PersonDetailPage";
import { CareerPathPage } from "./pages/CareerPathPage";
import { SkillGapsPage } from "./pages/SkillGapsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/:roleId" element={<RoleDetailPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="skills/:skillId" element={<SkillDetailPage />} />
          <Route path="tracks" element={<TracksPage />} />
          <Route path="tracks/:trackId" element={<TrackDetailPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="people/:personId" element={<PersonDetailPage />} />
          <Route path="career-path" element={<CareerPathPage />} />
          <Route path="skill-gaps" element={<SkillGapsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
