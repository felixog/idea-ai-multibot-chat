import { AtSign, Plus, Sparkles, Check, CircleCheck, WandSparkles } from 'lucide-react';
import { Avatar, AvatarStack } from '../../components/rekka/Avatar/Avatar';
import { CharacterTag } from '../../components/rekka/CharacterTag/CharacterTag';
import { AddresseeChip } from '../../components/rekka/AddresseeChip/AddresseeChip';
import { Button, type ButtonVariant } from '../../components/rekka/Button/Button';
import { IconButton, type IconButtonVariant } from '../../components/rekka/IconButton/IconButton';
import { StatusBadge } from '../../components/rekka/StatusBadge/StatusBadge';
import { TypingDots } from '../../components/rekka/TypingIndicator/TypingIndicator';
import { Toast } from '../../components/rekka/Toast/Toast';
import { Block } from './Block';
import { MediaGallery } from './MediaGallery';
import s from './Gallery.module.css';

const noop = () => {};

const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ai', 'link'];
const ICON_VARIANTS: IconButtonVariant[] = ['plain', 'outline', 'secondary', 'primary', 'dark'];

export function PrimitivesGallery() {
  return (
    <>
      <Block title="Avatar" node="62:25">
        {(['nova', 'iris'] as const).map((c) =>
          (['xs', 'sm', 'md', 'lg'] as const).map((size) => <Avatar key={c + size} character={c} size={size} />),
        )}
        <AvatarStack />
        <AvatarStack overlap="mobile" />
        <Avatar character="nova" size="lg" muted />
      </Block>
      <Block title="CharacterTag" node="62:33">
        <CharacterTag character="nova" />
        <CharacterTag character="iris" />
      </Block>
      <Block title="AddresseeChip" node="62:45">
        <AddresseeChip character="nova" onRemove={noop} />
        <AddresseeChip character="iris" onRemove={noop} />
      </Block>
      <Block title="Button" node="62:129">
        {BUTTON_VARIANTS.map((v) =>
          (['sm', 'md'] as const).map((size) => (
            <Button key={v + size} variant={v} size={size} icon={WandSparkles}>
              Button
            </Button>
          )),
        )}
        <Button variant="ai" size="sm" icon={Sparkles} disabled>
          Make changes
        </Button>
        <Button variant="secondary" size="md" icon={Plus}>
          Add a character
        </Button>
        <Button variant="tertiary" size="md" icon={AtSign}>
          Mention
        </Button>
      </Block>
      <Block title="IconButton" node="62:193">
        {ICON_VARIANTS.map((v) =>
          (['sm', 'md', 'lg'] as const).map((size) => (
            <IconButton key={v + size} variant={v} size={size} icon={Plus} label={`${v} ${size}`} />
          )),
        )}
      </Block>
      <Block title="StatusBadge">
        <StatusBadge icon={Sparkles}>Editing</StatusBadge>
        <StatusBadge icon={Check}>Ready to review</StatusBadge>
        <StatusBadge icon={CircleCheck} tone="constructive">
          Applied
        </StatusBadge>
      </Block>
      <Block title="TypingIndicator (dots)">
        <TypingDots character="iris" />
      </Block>
      <Block title="Toast">
        <div className={s.toastHost}>
          <Toast message="Prompt copied" onDismiss={noop} persistent />
        </div>
        <div className={s.toastHost}>
          <Toast message="Back to v1" action={{ label: 'Redo', onClick: noop }} onDismiss={noop} persistent />
        </div>
      </Block>
    </>
  );
}

export default function Gallery() {
  return (
    <main className={s.page}>
      <h1 className="headline_2">Rex component gallery</h1>
      <PrimitivesGallery />
      <MediaGallery />
    </main>
  );
}
