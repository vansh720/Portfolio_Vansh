import RbacVisual from './RbacVisual';
import ActivityVisual from './ActivityVisual';

export default function ProjectVisual({ type }) {
  return type === 'rbac' ? <RbacVisual /> : <ActivityVisual />;
}
