# Page Template Guide

This directory contains reusable page templates for the Aframp dashboard. Use these templates to create new pages quickly while maintaining consistent design and behavior across the application.

## Quick Start

```tsx
import PageTemplate, { PageCard, StatsGrid } from '@/templates/PageTemplate';

export default function MyNewPage() {
  const { data, isLoading, error } = useQuery(/* ... */);

  return (
    <PageTemplate
      title="My Page Title"
      subtitle="Optional description"
      isLoading={isLoading}
      error={error}
    >
      <PageCard title="Content Section">
        {/* Your content */}
      </PageCard>
    </PageTemplate>
  );
}
```

## Components

### PageTemplate

The main wrapper component for pages. Handles loading states, errors, headers, breadcrumbs, and action buttons.

**Props:**
- `title` (string, required) - Page title
- `subtitle` (string, optional) - Subtitle/description
- `icon` (ReactNode, optional) - Icon to display next to title (emoji or SVG)
- `children` (ReactNode, required) - Page content
- `isLoading` (boolean, optional) - Shows loading skeleton when true
- `error` (Error | string | null, optional) - Shows error state when provided
- `actions` (ReactNode, optional) - Header action buttons (top right)
- `breadcrumb` (array, optional) - Breadcrumb navigation
- `contentClassName` (string, optional) - Custom className for content wrapper

**Example with All Props:**
```tsx
<PageTemplate
  title="Transactions"
  subtitle="View all your private payments"
  icon="📊"
  isLoading={isLoading}
  error={error}
  breadcrumb={[
    { label: 'Home', href: '/' },
    { label: 'Transactions' }
  ]}
  actions={
    <button>Export</button>
  }
>
  {/* Content */}
</PageTemplate>
```

### PageCard

A styled card component for organizing content sections with header, title, and optional action.

**Props:**
- `title` (string, required) - Card title
- `subtitle` (string, optional) - Subtitle
- `children` (ReactNode, required) - Card content
- `className` (string, optional) - Additional Tailwind classes
- `headerAction` (ReactNode, optional) - Button/action in header (top right)

**Example:**
```tsx
<PageCard
  title="Merchant Details"
  subtitle="Your account information"
  headerAction={<button>Edit</button>}
>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-gray-500">Merchant ID</p>
      <p className="font-medium">demo_001</p>
    </div>
  </div>
</PageCard>
```

### StatsGrid

Displays key metrics in a responsive grid with optional trends and colored icons.

**Props:**
- `stats` (StatItem[], required) - Array of stat objects

**StatItem Interface:**
```tsx
{
  label: string;           // Metric label
  value: string | number;  // The value to display
  icon?: ReactNode;        // Icon (emoji)
  trend?: {                // Optional trend indicator
    value: number;         // Percentage change
    isPositive: boolean;   // Direction
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}
```

**Example:**
```tsx
const stats: StatItem[] = [
  {
    label: 'Total Volume',
    value: '$12,345.67',
    icon: '💰',
    color: 'blue',
    trend: { value: 12, isPositive: true }
  },
  {
    label: 'Transactions',
    value: 342,
    icon: '📊',
    color: 'green'
  }
];

<StatsGrid stats={stats} />
```

### EmptyState

Displays a centered message for when there's no data.

**Props:**
- `icon` (ReactNode, optional) - Large emoji or icon
- `title` (string, required) - Main heading
- `description` (string, required) - Supporting text
- `action` (optional) - Button with label and onClick handler

**Example:**
```tsx
<EmptyState
  icon="📭"
  title="No transactions yet"
  description="Start accepting payments to see them here"
  action={{
    label: 'Create Transaction',
    onClick: () => navigate('/new-transaction')
  }}
/>
```

### ConfirmationModal

Modal for confirming destructive or important actions.

**Props:**
- `isOpen` (boolean, required) - Controls visibility
- `title` (string, required) - Modal heading
- `description` (string, required) - Confirmation message
- `confirmLabel` (string, optional, default: "Confirm")
- `cancelLabel` (string, optional, default: "Cancel")
- `isDangerous` (boolean, optional) - Makes confirm button red when true
- `onConfirm` (() => void, required) - Callback when confirming
- `onCancel` (() => void, required) - Callback when canceling

**Example:**
```tsx
const [showModal, setShowModal] = useState(false);

<ConfirmationModal
  isOpen={showModal}
  title="Delete Transaction"
  description="This cannot be undone."
  confirmLabel="Delete"
  isDangerous={true}
  onConfirm={handleDelete}
  onCancel={() => setShowModal(false)}
/>
```

## Design Patterns

### 1. Loading State

The template automatically handles loading states. Just pass `isLoading={true}`:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData
});

<PageTemplate
  title="My Page"
  isLoading={isLoading}
  error={error}
>
  {/* Your content */}
</PageTemplate>
```

The template shows a skeleton loader while data is being fetched.

### 2. Error Handling

Errors are displayed automatically:

```tsx
<PageTemplate
  title="My Page"
  error={error}  // Shows if error exists
>
  {/* Your content */}
</PageTemplate>
```

The error component includes a "Try Again" button that reloads the page.

### 3. Breadcrumb Navigation

For multi-level pages, add breadcrumb:

```tsx
<PageTemplate
  title="Transaction Details"
  breadcrumb={[
    { label: 'Home', href: '/' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'TX-12345' }  // Current page (no href)
  ]}
>
  {/* Content */}
</PageTemplate>
```

### 4. Header Actions

Add buttons to the page header:

```tsx
<PageTemplate
  title="Transactions"
  actions={
    <div className="flex space-x-3">
      <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
        Filter
      </button>
      <button className="px-4 py-2 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800">
        Export
      </button>
    </div>
  }
>
  {/* Content */}
</PageTemplate>
```

### 5. Complex Multi-Section Pages

Organize complex pages with multiple PageCard sections:

```tsx
<PageTemplate title="Settings" icon="⚙️">
  <div className="space-y-6">
    <PageCard title="General Settings">
      {/* Section 1 content */}
    </PageCard>

    <PageCard title="Privacy Settings">
      {/* Section 2 content */}
    </PageCard>

    <PageCard title="Advanced Options">
      {/* Section 3 content */}
    </PageCard>
  </div>
</PageTemplate>
```

## Color Palette

The template uses these colors (from Aframp design system):

- **Primary**: `bg-navy-900`, `text-navy-900`
- **Accent**: `bg-gold-500`, `text-gold-500`
- **Neutrals**: Gray 50-950 scale
- **Status**: Green (success), Red (error), Yellow (warning), Blue (info)

All component buttons follow the navy/gold color scheme.

## Responsive Behavior

All template components are fully responsive:

- **Mobile-first design** - Optimized for small screens first
- **Tablet support** - Two-column layouts at `md:` breakpoint
- **Desktop** - Four-column layouts at `lg:` breakpoint

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

## Accessibility

- All buttons and interactive elements are keyboard accessible
- Color is never the only indicator of status (text labels included)
- Loading and error states are announced properly
- Modal backdrop prevents interaction with page content

## Performance Tips

1. **Use React Query** - Combine with `@tanstack/react-query` for automatic caching
2. **Lazy load content** - Use tabs or pagination for large lists
3. **Memoize expensive components** - Use `React.memo()` for card content
4. **Pagination** - Break large data sets into pages

Example:
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['transactions', page],
  queryFn: () => API.getTransactions(page),
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
});
```

## File Structure

```
templates/
├── PageTemplate.tsx                 # Main component file
├── EXAMPLE_PageImplementation.tsx   # Examples of usage
└── README.md                        # This file
```

## Common Use Cases

### Analytics Dashboard
See `ExampleStatsPage()` in EXAMPLE_PageImplementation.tsx

### Settings/Configuration Page
See `ExampleActionsPage()` in EXAMPLE_PageImplementation.tsx

### List with Empty State
See `ExampleComplexPage()` in EXAMPLE_PageImplementation.tsx

### Data Entry Form
Wrap `<form>` inside `<PageCard>` within `<PageTemplate>`

## Troubleshooting

**Loading state doesn't disappear?**
- Check that `isLoading` is actually becoming `false` after data loads

**Buttons don't align properly?**
- Use Tailwind flex utilities: `flex space-x-3` for spacing

**Content overflows on mobile?**
- Add responsive breakpoints: `md:grid-cols-2` not `grid-cols-2`

**Colors look wrong?**
- Ensure Tailwind CSS includes the `navy-*` and `gold-*` color tokens
- Check `tailwind.config.ts` extends the theme with custom colors

## Questions?

Refer to the existing pages in `/pages` for real-world examples:
- `Dashboard.tsx` - Stats and charts
- `Settings.tsx` - Form sections
- `Home.tsx` - Hero and marketing sections
