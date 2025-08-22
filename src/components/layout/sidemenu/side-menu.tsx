'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  Home,
  BookOpen,
  Megaphone,
  MessageSquare,
  Users,
  BookTemplate,
  FolderTree,
  FlaskRound,
  GraduationCap,
  Users2,
  Presentation,
  GraduationCapIcon,
  Building2,
  MapPin,
  Building,
  FileText,
  LucideGraduationCap,
  School,
  Award,
  UserRound,
  Receipt,
  CreditCard,
} from 'lucide-react'
import { Link, usePathname } from '@/i18n/routing'
import { routes } from '@/lib/const/routes.enum'
import { useWindowSize } from '@/lib/useWindowSize'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SideMenuProps {
  showOnlyIcons?: boolean
}

export const SideMenu = ({ showOnlyIcons = false }: SideMenuProps) => {
  const t = useTranslations('nav')
  const tg = useTranslations('navGroups')
  const { width } = useWindowSize()

  const topItems = [{ href: '/', label: t('home'), icon: Home }]

  const groups: {
    key: string
    label: string
    items: { href: string; label: string; icon: React.ElementType }[]
  }[] = [
    {
      key: 'academy',
      label: tg('academy'),
      items: [
        { href: `/${routes.branches}`, label: t('branches'), icon: Building },
        { href: `/${routes.labs}`, label: t('labs'), icon: FlaskRound },
        { href: `/${routes.lectures}`, label: t('lectures'), icon: Presentation },
      ],
    },
    {
      key: 'education',
      label: tg('education'),
      items: [
        { href: `/${routes.categories}`, label: t('categories'), icon: FolderTree },
        { href: `/${routes.courses}`, label: t('courses'), icon: BookOpen },
        { href: `/${routes.courseGroups}`, label: t('course-groups'), icon: Users2 },
        { href: `/${routes.lecturers}`, label: t('lecturers'), icon: GraduationCap },
      ],
    },
    {
      key: 'crm',
      label: tg('crm'),
      items: [
        { href: `/${routes.students}`, label: t('students'), icon: GraduationCapIcon },
        { href: `/${routes.leads}`, label: t('leads'), icon: Users },
        { href: `/${routes.employees}`, label: t('employees'), icon: UserRound },
      ],
    },
    {
      key: 'finance',
      label: tg('finance'),
      items: [
        { href: `/${routes.receipts}`, label: t('receipt'), icon: Receipt },
        { href: `/${routes.expenses}`, label: t('expense'), icon: CreditCard },
      ],
    },
    {
      key: 'messages',
      label: tg('messages'),
      items: [
        { href: `/${routes.messages}`, label: t('messages'), icon: MessageSquare },
        { href: `/${routes.messageTemplate}`, label: t('message-template'), icon: BookTemplate },
        { href: `/${routes.campaigns}`, label: t('campaigns'), icon: Megaphone },
      ],
    },
    {
      key: 'system',
      label: tg('system'),
      items: [
        { href: `/${routes.cities}`, label: t('cities'), icon: Building2 },
        { href: `/${routes.areas}`, label: t('areas'), icon: MapPin },
        { href: `/${routes.agreements}`, label: t('agreements'), icon: FileText },
        { href: `/${routes.qualificationDescription}`, label: t('qualification-description'), icon: LucideGraduationCap },
        { href: `/${routes.qualificationIssuer}`, label: t('qualification-issuer'), icon: School },
        { href: `/${routes.qualificationType}`, label: t('qualification-type'), icon: Award },
      ],
    },
  ]

  const content = (
    <div className="flex flex-col gap-2 py-4">
      {topItems.map((item) =>
        width > 768 ? (
          <SideMenuDesktop showOnlyIcons={showOnlyIcons} key={item.href} item={item} />
        ) : (
          <SideMenuMobile key={item.href} item={item} />
        )
      )}

      {/* Groups */}
      <Accordion type="multiple" className="w-full">
        {groups.map((group) => (
          <AccordionItem value={group.key} key={group.key} className="border-none">
            <AccordionTrigger
              className="rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            >
              {group.label}
            </AccordionTrigger>
            <AccordionContent className="pl-2 pt-1">
              <div className="flex flex-col gap-1">
                {group.items.map((item) =>
                  width > 768 ? (
                    <SideMenuDesktop showOnlyIcons={showOnlyIcons} key={item.href} item={item} />
                  ) : (
                    <SideMenuMobile key={item.href} item={item} />
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return <nav>{content}</nav>
}

interface SideMenuElementProps {
  showOnlyIcons?: boolean
  item: {
    href: string
    label: string
    icon: React.ElementType
  }
}

export const SideMenuMobile = ({ item }: SideMenuElementProps) => {
  const pathname = usePathname()
  const Icon = item.icon
  return (
    // <SheetClose key={item.href} asChild>
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
        pathname.includes(item.href) && item.href !== '/' ? 'bg-accent text-accent-foreground' : 'transparent'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
    // </SheetClose>
  )
}

export const SideMenuDesktop = ({ item, showOnlyIcons = false }: SideMenuElementProps) => {
  const Icon = item.icon
  const pathname = usePathname()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname.includes(item.href) && item.href !== '/' ? 'bg-accent text-accent-foreground' : 'transparent',
              showOnlyIcons && 'justify-center'
            )}
          >
            <Icon className="h-4 w-4" />

            {!showOnlyIcons && <span>{item.label}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
