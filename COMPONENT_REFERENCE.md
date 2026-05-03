# Component Reference Guide

## 🎨 Component Hierarchy

```
App (with ToastProvider)
├── Navbar
├── Routes
│   ├── Login
│   ├── Signup
│   ├── Dashboard
│   ├── Projects
│   └── Tasks
└── ToastContainer
```

## 📦 Reusable Components

### Toast Components

#### `useToast()` Hook
```jsx
const { addToast, removeToast, toasts } = useToast();

// Usage
addToast('Success!', 'success', 3000);
addToast('Error!', 'error', 3000);
addToast('Info!', 'info', 3000);
```

#### `<ToastContainer />`
- Displays toast notifications in fixed bottom-right position
- Auto-positions multiple toasts
- Shows close button for manual dismissal

### Modal Components

#### `<Modal />`
```jsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="md" // sm, md, lg, xl
>
  Content here
</Modal>
```

### Card Components

#### `<Card />`
```jsx
<Card className="optional-classes">
  Content
</Card>
```

#### `<CardHeader />`
```jsx
<CardHeader>
  Content
</CardHeader>
```

#### `<CardTitle />`
```jsx
<CardTitle>Title</CardTitle>
```

#### `<CardDescription />`
```jsx
<CardDescription>Description</CardDescription>
```

#### `<CardContent />`
```jsx
<CardContent>
  Content
</CardContent>
```

#### `<CardFooter />`
```jsx
<CardFooter>
  Footer content
</CardFooter>
```

### Form Components

#### `<FormGroup />`
Container for form field groups
```jsx
<FormGroup>
  <Label>Field Label</Label>
  <Input type="text" />
</FormGroup>
```

#### `<Label />`
```jsx
<Label htmlFor="input-id" required>
  Label Text
</Label>
```

#### `<Input />`
```jsx
<Input
  type="text"
  placeholder="Placeholder"
  value={value}
  onChange={handleChange}
  error={errorMessage}
  disabled={false}
/>
```

#### `<Select />`
```jsx
<Select
  value={value}
  onChange={handleChange}
  error={errorMessage}
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
```

#### `<Textarea />`
```jsx
<Textarea
  value={value}
  onChange={handleChange}
  rows={4}
  error={errorMessage}
/>
```

#### `<FormError />`
```jsx
<FormError message="Error message" />
```

#### `<FormSuccess />`
```jsx
<FormSuccess message="Success message" />
```

### Status Components

#### `<StatusBadge />`
```jsx
// Status badge
<StatusBadge status="pending" />
<StatusBadge status="in-progress" />
<StatusBadge status="completed" />

// Priority badge
<StatusBadge priority="low" />
<StatusBadge priority="medium" />
<StatusBadge priority="high" />
<StatusBadge priority="urgent" />
```

### Loading Components

#### `<LoadingSpinner />`
```jsx
<LoadingSpinner size="md" message="Loading..." />
// size: sm, md, lg
```

#### `<PageLoadingSpinner />`
```jsx
<PageLoadingSpinner />
// Full page loading state
```

### Empty State Components

#### `<EmptyState />`
```jsx
<EmptyState
  type="projects" // or tasks, default
  title="No projects"
  description="Create your first project"
  action={{
    label: "Create",
    onClick: () => {}
  }}
/>
```

## 🎯 Tailwind CSS Utility Classes

### Buttons

```jsx
// Primary button
<button className="btn btn-primary">Click me</button>

// Secondary button
<button className="btn btn-secondary">Click me</button>

// Danger button
<button className="btn btn-danger">Delete</button>

// Small button
<button className="btn btn-primary btn-small">Small</button>

// Disabled state
<button className="btn btn-primary" disabled>Disabled</button>
```

### Cards

```jsx
// Basic card
<div className="card">Content</div>

// Card with hover effect
<div className="card card-hover">Content</div>

// Card with custom padding
<div className="card p-8">Content</div>
```

### Badges

```jsx
// Primary badge
<span className="badge badge-primary">Primary</span>

// Success badge
<span className="badge badge-success">Success</span>

// Warning badge
<span className="badge badge-warning">Warning</span>

// Danger badge
<span className="badge badge-danger">Danger</span>

// Gray badge
<span className="badge badge-gray">Gray</span>
```

### Input Fields

```jsx
// Input class
<input className="input" type="text" />

// Input with error
<input className="input border-red-500 focus:ring-red-500" type="text" />
```

### Layout

```jsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex
<div className="flex items-center justify-between gap-4">

// Spacing
<div className="p-6 m-4 gap-2">
```

## 🎨 Color Palette

### Primary Colors
```
indigo-50, indigo-100, indigo-200, indigo-300, indigo-400, indigo-500,
indigo-600, indigo-700, indigo-800, indigo-900
```

### Neutral Colors
```
gray-50 (lightest) → gray-900 (darkest)
```

### Semantic Colors
- **Success**: green-100, green-600, green-800
- **Error**: red-100, red-600, red-800
- **Warning**: yellow-100, yellow-600, yellow-800
- **Info**: blue-100, blue-600, blue-800

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage**: `md:flex`, `lg:grid-cols-3`, `sm:px-4`

## ✨ Animations

### Fade In
```jsx
<div className="animate-fade-in">Content</div>
```

### Slide In
```jsx
<div className="animate-slide-in">Content</div>
```

### Spin
```jsx
<div className="animate-spin">Loading...</div>
```

### Pulse
```jsx
<div className="animate-pulse">Pulsing</div>
```

## 🎪 Icon Usage (Lucide React)

```jsx
import { Plus, Edit, Trash2, ChevronRight, X, Menu } from 'lucide-react';

// Usage
<Plus className="w-5 h-5" />
<Edit className="w-4 h-4" />
<Trash2 className="w-4 h-4 text-red-600" />
```

### Common Icons in Project
- `Plus` - Add/Create
- `Edit` - Edit action
- `Trash2` - Delete action
- `X` - Close
- `Menu` - Mobile menu
- `LogOut` - Logout
- `User` - User profile
- `CheckCircle2` - Completed
- `AlertCircle` - Alert/Error
- `Clock` - Pending
- `Zap` - In Progress
- `FolderOpen` - Projects
- `CheckSquare` - Tasks
- `Users` - Team members
- `Calendar` - Dates
- `Loader` - Loading spinner
- `ArrowRight` - Navigation

## 🔧 Common Patterns

### Creating a Form
```jsx
import { FormGroup, Label, Input, Textarea, Select } from '../components/Form';

<form onSubmit={handleSubmit}>
  <FormGroup>
    <Label htmlFor="name" required>Name</Label>
    <Input
      id="name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </FormGroup>

  <FormGroup>
    <Label htmlFor="email" required>Email</Label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </FormGroup>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>
```

### Creating a Modal Form
```jsx
import { Modal } from '../components/Modal';
import { FormGroup, Label, Input } from '../components/Form';

const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(true)}>Open</button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Item"
>
  <form onSubmit={handleSubmit}>
    <FormGroup>
      <Label htmlFor="title" required>Title</Label>
      <Input id="title" type="text" required />
    </FormGroup>
    <div className="flex gap-3 pt-4 border-t border-gray-200">
      <button type="submit" className="btn btn-primary flex-1">Create</button>
      <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary flex-1">
        Cancel
      </button>
    </div>
  </form>
</Modal>
```

### Creating a Card List
```jsx
import { Card, CardHeader, CardTitle } from '../components/Card';

<Card>
  <CardHeader>
    <CardTitle>Items</CardTitle>
  </CardHeader>
  <div className="space-y-2">
    {items.map(item => (
      <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
        {item.name}
      </div>
    ))}
  </div>
</Card>
```

## 🚀 Performance Tips

1. **Lazy load components** for routes
2. **Use React.memo** for expensive components
3. **Debounce search inputs**
4. **Use CSS utilities** instead of custom CSS
5. **Minimize re-renders** with proper state management
6. **Use key prop** in lists

## 🐛 Troubleshooting

### Toast not showing
- Ensure `<ToastContainer />` is in App.jsx
- Ensure component is wrapped with `<ToastProvider>`
- Check that `useToast()` hook is being used

### Modal not opening
- Check `isOpen` state is controlled properly
- Ensure `onClose` handler updates state
- Verify Modal component receives `title` prop

### Tailwind classes not applying
- Make sure Tailwind config includes your component files
- Restart dev server after config changes
- Check CSS specificity issues

## 📚 Learn More

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [CSS Utilities](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Happy coding! 🚀**
