import { type ReactNode } from 'react'
import { EFontType, ETextSize, Text } from '@sberbusiness/triplex-next'
import styles from './styles.module.css'

export interface UpperMenuProps {
  title?: string
  subtitle?: string
  rightSlot?: ReactNode
}

const UpperMenu = ({
  title = 'СберАналитика',
  subtitle = 'Центр программного обеспечения',
  rightSlot,
}: UpperMenuProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Text size={ETextSize.B2} type={EFontType.PRIMARY}>
          {title}
        </Text>
        <Text size={ETextSize.B3} type={EFontType.SECONDARY}>
          {subtitle}
        </Text>
      </div>

      <div className={styles.right}>
        {rightSlot ?? (
          <Text size={ETextSize.B3} type={EFontType.SECONDARY}>
            Пользователь
          </Text>
        )}
      </div>
    </div>
  )
}

export default UpperMenu
