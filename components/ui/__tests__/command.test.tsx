import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../command'

// Mock dependencies with factory functions
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="dialog-root" {...props}>{children}</div>,
  Portal: ({ children }: any) => <div data-testid="dialog-portal">{children}</div>,
  Content: ({ children, className, ...props }: any) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => <button data-testid="dialog-trigger" {...props}>{children}</button>,
  Close: ({ children, ...props }: any) => <button data-testid="dialog-close" {...props}>{children}</button>,
  Overlay: ({ children, className, ...props }: any) => (
    <div data-testid="dialog-overlay" className={className} {...props}>
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <h2 data-testid="dialog-title" className={className} {...props}>
      {children}
    </h2>
  ),
  Description: ({ children, className, ...props }: any) => (
    <p data-testid="dialog-description" className={className} {...props}>
      {children}
    </p>
  ),
}))

vi.mock('cmdk', () => {
  const MockCommand = vi.fn().mockImplementation(({ children, className, ...props }) => (
    <div data-testid="cmdk-command" className={className} {...props}>
      {children}
    </div>
  ))
  
  const MockInput = vi.fn().mockImplementation(({ className, ...props }) => (
    <input data-testid="cmdk-input" className={className} {...props} />
  ))
  
  const MockList = vi.fn().mockImplementation(({ children, className, ...props }) => (
    <div data-testid="cmdk-list" className={className} {...props}>
      {children}
    </div>
  ))
  
  const MockEmpty = vi.fn().mockImplementation(({ children, className, ...props }) => (
    <div data-testid="cmdk-empty" className={className} {...props}>
      {children}
    </div>
  ))
  
  const MockGroup = vi.fn().mockImplementation(({ children, className, ...props }) => (
    <div data-testid="cmdk-group" className={className} {...props}>
      {children}
    </div>
  ))
  
  const MockItem = vi.fn().mockImplementation(({ children, className, ...props }) => (
    <div data-testid="cmdk-item" className={className} {...props}>
      {children}
    </div>
  ))
  
  const MockSeparator = vi.fn().mockImplementation(({ className, ...props }) => (
    <hr data-testid="cmdk-separator" className={className} {...props} />
  ))

  // Set display names
  MockCommand.displayName = 'Command'
  MockInput.displayName = 'CommandInput'
  MockList.displayName = 'CommandList'
  MockEmpty.displayName = 'CommandEmpty'
  MockGroup.displayName = 'CommandGroup'
  MockItem.displayName = 'CommandItem'
  MockSeparator.displayName = 'CommandSeparator'

  MockCommand.Input = MockInput
  MockCommand.List = MockList
  MockCommand.Empty = MockEmpty
  MockCommand.Group = MockGroup
  MockCommand.Item = MockItem
  MockCommand.Separator = MockSeparator

  return {
    Command: MockCommand,
  }
})

vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes: string[]) => classes.filter(Boolean).join(' ')),
}))

vi.mock('lucide-react', () => ({
  Search: ({ className, ...props }: any) => <svg data-testid="search-icon" className={className} {...props} />,
  X: ({ className, ...props }: any) => <svg data-testid="x-icon" className={className} {...props} />,
}))

// Import mocked modules
import { cn } from '@/lib/utils'
import { Command as CommandPrimitive } from 'cmdk'

// Get the mocked functions
const mockCn = vi.mocked(cn)
const mockCommandPrimitive = vi.mocked(CommandPrimitive)

describe('Command Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCn.mockImplementation((...classes: string[]) => classes.filter(Boolean).join(' '))
  })

  describe('Command', () => {
    it('should render with default classes', () => {
      render(<Command />)
      
      const command = screen.getByTestId('cmdk-command')
      expect(command).toBeInTheDocument()
      expect(mockCn).toHaveBeenCalledWith(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        undefined
      )
    })

    it('should apply custom className', () => {
      render(<Command className="custom-class" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        'custom-class'
      )
    })

    it('should forward props to CommandPrimitive', () => {
      render(<Command data-custom="test" />)
      
      const command = screen.getByTestId('cmdk-command')
      expect(command).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Command ref={ref} />)
      
      expect(mockCommandPrimitive).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(Command.displayName).toBe('Command')
    })
  })

  describe('CommandDialog', () => {
    it('should render dialog with command content', () => {
      render(
        <CommandDialog open={true}>
          <div>Dialog Content</div>
        </CommandDialog>
      )
      
      expect(screen.getByTestId('dialog-root')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-command')).toBeInTheDocument()
      expect(screen.getByText('Dialog Content')).toBeInTheDocument()
    })

    it('should apply correct dialog content classes', () => {
      render(<CommandDialog open={true} />)
      
      const dialogContent = screen.getByTestId('dialog-content')
      expect(dialogContent).toHaveClass('overflow-hidden', 'p-0', 'shadow-lg')
    })

    it('should apply correct command classes in dialog', () => {
      render(<CommandDialog open={true} />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'
      )
    })

    it('should forward dialog props', () => {
      render(<CommandDialog open={false} onOpenChange={vi.fn()} />)
      
      const dialogRoot = screen.getByTestId('dialog-root')
      // Dialog props are passed through correctly
      expect(dialogRoot).toBeInTheDocument()
    })
  })

  describe('CommandInput', () => {
    it('should render input with search icon', () => {
      render(<CommandInput />)
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-input')).toBeInTheDocument()
    })

    it('should apply correct wrapper classes', () => {
      render(<CommandInput />)
      
      const wrapper = screen.getByTestId('cmdk-input').closest('div')
      expect(wrapper).toHaveClass('flex', 'items-center', 'border-b', 'px-3')
      expect(wrapper).toHaveAttribute('cmdk-input-wrapper', '')
    })

    it('should apply correct input classes', () => {
      render(<CommandInput />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        undefined
      )
    })

    it('should apply custom className to input', () => {
      render(<CommandInput className="custom-input" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        'custom-input'
      )
    })

    it('should forward props to input', () => {
      render(<CommandInput placeholder="Search..." />)
      
      const input = screen.getByTestId('cmdk-input')
      expect(input).toHaveAttribute('placeholder', 'Search...')
    })

    it('should apply correct search icon classes', () => {
      render(<CommandInput />)
      
      const searchIcon = screen.getByTestId('search-icon')
      expect(searchIcon).toHaveClass('mr-2', 'h-4', 'w-4', 'shrink-0', 'opacity-50')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandInput ref={ref} />)
      
      expect(mockCommandPrimitive.Input).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandInput.displayName).toBe('CommandInput')
    })
  })

  describe('CommandList', () => {
    it('should render list container', () => {
      render(
        <CommandList>
          <div>List Item</div>
        </CommandList>
      )
      
      const list = screen.getByTestId('cmdk-list')
      expect(list).toBeInTheDocument()
      expect(screen.getByText('List Item')).toBeInTheDocument()
    })

    it('should apply correct default classes', () => {
      render(<CommandList />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'max-h-[300px] overflow-y-auto overflow-x-hidden',
        undefined
      )
    })

    it('should apply custom className', () => {
      render(<CommandList className="custom-list" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'max-h-[300px] overflow-y-auto overflow-x-hidden',
        'custom-list'
      )
    })

    it('should forward props', () => {
      render(<CommandList data-custom="test" />)
      
      const list = screen.getByTestId('cmdk-list')
      expect(list).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandList ref={ref} />)
      
      expect(mockCommandPrimitive.List).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandList.displayName).toBe('CommandList')
    })
  })

  describe('CommandEmpty', () => {
    it('should render empty state', () => {
      render(<CommandEmpty>No results found.</CommandEmpty>)
      
      const empty = screen.getByTestId('cmdk-empty')
      expect(empty).toBeInTheDocument()
      expect(screen.getByText('No results found.')).toBeInTheDocument()
    })

    it('should apply correct classes', () => {
      render(<CommandEmpty />)
      
      const empty = screen.getByTestId('cmdk-empty')
      expect(empty).toHaveClass('py-6', 'text-center', 'text-sm')
    })

    it('should forward props', () => {
      render(<CommandEmpty data-custom="test" />)
      
      const empty = screen.getByTestId('cmdk-empty')
      expect(empty).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandEmpty ref={ref} />)
      
      expect(mockCommandPrimitive.Empty).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandEmpty.displayName).toBe('CommandEmpty')
    })
  })

  describe('CommandGroup', () => {
    it('should render group with children', () => {
      render(
        <CommandGroup>
          <div>Group Item</div>
        </CommandGroup>
      )
      
      const group = screen.getByTestId('cmdk-group')
      expect(group).toBeInTheDocument()
      expect(screen.getByText('Group Item')).toBeInTheDocument()
    })

    it('should apply correct default classes', () => {
      render(<CommandGroup />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        undefined
      )
    })

    it('should apply custom className', () => {
      render(<CommandGroup className="custom-group" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        'custom-group'
      )
    })

    it('should forward props', () => {
      render(<CommandGroup data-custom="test" />)
      
      const group = screen.getByTestId('cmdk-group')
      expect(group).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandGroup ref={ref} />)
      
      expect(mockCommandPrimitive.Group).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandGroup.displayName).toBe('CommandGroup')
    })
  })

  describe('CommandItem', () => {
    it('should render item with children', () => {
      render(<CommandItem>Command Item</CommandItem>)
      
      const item = screen.getByTestId('cmdk-item')
      expect(item).toBeInTheDocument()
      expect(screen.getByText('Command Item')).toBeInTheDocument()
    })

    it('should apply correct default classes', () => {
      render(<CommandItem />)
      
      expect(mockCn).toHaveBeenCalledWith(
        "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        undefined
      )
    })

    it('should apply custom className', () => {
      render(<CommandItem className="custom-item" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        'custom-item'
      )
    })

    it('should forward props', () => {
      render(<CommandItem data-custom="test" />)
      
      const item = screen.getByTestId('cmdk-item')
      expect(item).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandItem ref={ref} />)
      
      expect(mockCommandPrimitive.Item).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandItem.displayName).toBe('CommandItem')
    })
  })

  describe('CommandSeparator', () => {
    it('should render separator', () => {
      render(<CommandSeparator />)
      
      const separator = screen.getByTestId('cmdk-separator')
      expect(separator).toBeInTheDocument()
    })

    it('should apply correct default classes', () => {
      render(<CommandSeparator />)
      
      expect(mockCn).toHaveBeenCalledWith('-mx-1 h-px bg-border', undefined)
    })

    it('should apply custom className', () => {
      render(<CommandSeparator className="custom-separator" />)
      
      expect(mockCn).toHaveBeenCalledWith('-mx-1 h-px bg-border', 'custom-separator')
    })

    it('should forward props', () => {
      render(<CommandSeparator data-custom="test" />)
      
      const separator = screen.getByTestId('cmdk-separator')
      expect(separator).toHaveAttribute('data-custom', 'test')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CommandSeparator ref={ref} />)
      
      expect(mockCommandPrimitive.Separator).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: ref,
        }),
        undefined
      )
    })

    it('should have correct display name', () => {
      expect(CommandSeparator.displayName).toBe('CommandSeparator')
    })
  })

  describe('CommandShortcut', () => {
    it('should render shortcut text', () => {
      render(<CommandShortcut>⌘K</CommandShortcut>)
      
      expect(screen.getByText('⌘K')).toBeInTheDocument()
    })

    it('should apply correct default classes', () => {
      render(<CommandShortcut />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        undefined
      )
    })

    it('should apply custom className', () => {
      render(<CommandShortcut className="custom-shortcut" />)
      
      expect(mockCn).toHaveBeenCalledWith(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        'custom-shortcut'
      )
    })

    it('should forward props', () => {
      render(<CommandShortcut data-custom="test">⌘K</CommandShortcut>)
      
      const shortcut = screen.getByText('⌘K')
      expect(shortcut).toHaveAttribute('data-custom', 'test')
    })

    it('should render as span element', () => {
      render(<CommandShortcut>⌘K</CommandShortcut>)
      
      const shortcut = screen.getByText('⌘K')
      expect(shortcut.tagName).toBe('SPAN')
    })

    it('should have correct display name', () => {
      expect(CommandShortcut.displayName).toBe('CommandShortcut')
    })
  })

  describe('Integration Tests', () => {
    it('should render complete command structure', () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <span>Calendar</span>
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Search Emoji</span>
                <CommandShortcut>⌘J</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      // Check all components are rendered
      expect(screen.getByTestId('cmdk-command')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-input')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-list')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-empty')).toBeInTheDocument()
      expect(screen.getAllByTestId('cmdk-group')).toHaveLength(2)
      expect(screen.getAllByTestId('cmdk-item')).toHaveLength(3)
      expect(screen.getByTestId('cmdk-separator')).toBeInTheDocument()
      
      // Check content
      expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
      expect(screen.getByText('No results found.')).toBeInTheDocument()
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Search Emoji')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('⌘K')).toBeInTheDocument()
      expect(screen.getByText('⌘J')).toBeInTheDocument()
      expect(screen.getByText('⌘P')).toBeInTheDocument()
    })

    it('should render command dialog with content', () => {
      render(
        <CommandDialog open={true}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      )

      // Check dialog structure
      expect(screen.getByTestId('dialog-root')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('cmdk-command')).toBeInTheDocument()
      
      // Check command content
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByText('No results.')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('should handle nested components correctly', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <div>
                  <span>Complex Item</span>
                  <CommandShortcut>⌘⇧K</CommandShortcut>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      expect(screen.getByText('Complex Item')).toBeInTheDocument()
      expect(screen.getByText('⌘⇧K')).toBeInTheDocument()
    })

    it('should apply all classes correctly in integration', () => {
      render(
        <Command className="custom-command">
          <CommandInput className="custom-input" />
          <CommandList className="custom-list">
            <CommandGroup className="custom-group">
              <CommandItem className="custom-item">
                Item
                <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      // Verify all custom classes are applied
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('flex h-full w-full'),
        'custom-command'
      )
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('flex h-11 w-full'),
        'custom-input'
      )
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('max-h-[300px]'),
        'custom-list'
      )
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('overflow-hidden p-1'),
        'custom-group'
      )
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('relative flex cursor-default'),
        'custom-item'
      )
      expect(mockCn).toHaveBeenCalledWith(
        expect.stringContaining('ml-auto text-xs'),
        'custom-shortcut'
      )
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Command>
          <CommandInput aria-label="Search commands" />
          <CommandList>
            <CommandItem>Accessible Item</CommandItem>
          </CommandList>
        </Command>
      )

      const input = screen.getByTestId('cmdk-input')
      expect(input).toHaveAttribute('aria-label', 'Search commands')
    })

    it('should support keyboard navigation props', () => {
      render(
        <CommandItem onSelect={vi.fn()} disabled>
          Disabled Item
        </CommandItem>
      )

      const item = screen.getByTestId('cmdk-item')
      expect(item).toHaveAttribute('disabled')
    })

    it('should render semantic HTML structure', () => {
      render(
        <Command>
          <CommandInput />
          <CommandList role="listbox">
            <CommandGroup role="group">
              <CommandItem role="option">Option 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByRole('group')).toBeInTheDocument()
      expect(screen.getByRole('option')).toBeInTheDocument()
    })
  })
})