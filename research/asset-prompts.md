# 마법책 이미지 제작 기록

방식: 내장 ImageGen. 배경: 투명 알파. 각 과목별로 별도 생성했고 국어 마법책을 다른 8권의 화풍 참조로 사용했습니다. 메이플스토리 같은 고전 한국 2D RPG의 장비 아이콘 감성을 참고한 신규 이미지이며 게임 원본 리소스를 복제하지 않았습니다.

최종 웹 자산: `dist/assets/books/{korean,math,social,science,english,ethics,pe,music,art}.webp` (384×384). 원본 생성 PNG는 원래 생성 위치에 보존합니다. WebP 변환은 크기·전송량 최적화이며 투명도를 유지합니다.

## 국어 첫 이미지 프롬프트

Crimson ruby leather magic spellbook, ornate gold corners and clasps, ivory feather quill emblem, pearl gem and curled bookmark. Original MapleStory-inspired Korean 2D MMORPG pixel-art item icon; closed thick tome, three-quarter view, front cover facing viewer, spine left, cream page edges bottom-right. Crisp fine square pixel edges, rich jewel shading, gold sparkles. One book, centered with transparent alpha, no background, text or frame.

## 나머지 8권의 공통 프롬프트

Use case: stylized-concept. Asset: ONE transparent game inventory spellbook icon. The supplied red quill book is a STYLE REFERENCE ONLY: match its beautiful intricate Korean 2D MMORPG / MapleStory-like pixel art, same closed thick tome silhouette, same 3/4 angle FRONT COVER facing viewer, spine left and ivory page edges bottom, ornate gold corner armor and clasp, curled gold bookmark with gem, rich jewel-tone shading, crisp fine square pixel edges, deep plum outline and glowing highlights. Create an ORIGINAL DIFFERENT SUBJECT BOOK described below. Keep coherent rare magical collectible quality. One book only, centered square composition 78% fill, transparent alpha everywhere outside object, generous clear margins, several tiny magical star sparkles. No text, no letters, no label, no frame, no floor, no background. Not flat vector, not line icon, not photorealistic.

## 과목별 프롬프트 추가 지시

### math

MATHEMATICS: royal sapphire BLUE leather magic book, icy blue gems, large beautifully faceted cyan DIAMOND CRYSTAL with an elegant golden geometric compass star and tiny plus rune on front cover. Arcane geometry, luminous blue enchantment.

### social

SOCIAL STUDIES: forest EMERALD GREEN leather magic book, glowing jade gems, gold and turquoise miniature GLOBE with a COMPASS ROSE as the central cover emblem, a tiny celestial navigation star. Treasure-map exploration.

### science

SCIENCE: rich TEAL leather magic book, aqua gems, central elegant round ALCHEMY FLASK filled with luminous mint-green potion and three tiny luminous bubbles, gold botanical filigree. Charming discovery magic.

### english

ENGLISH LANGUAGE: deep INDIGO and periwinkle leather magic book, violet-blue gems, central beautiful GOLD WINGED SPEECH ORB emblem, ivory feather accents and golden celestial communication rune shapes, NO letters.

### ethics

ETHICS AND KINDNESS: soft ROSE PINK leather magic book with magenta shaded spine, pink ruby gems, central luminous rose HEART GEM held by small golden angel wings, fine gold ornamental vines. Warm kindness enchantment.

### pe

PHYSICAL EDUCATION: vivid AMBER ORANGE leather magic book, orange topaz gems, central golden LIGHTNING BOLT with two little wing motifs and a laurel wreath, dynamic but refined. Energy and courage magic.

### music

MUSIC: royal AMETHYST PURPLE leather magic book, glowing violet gems, central intricate golden LYRE with luminous ivory strings, a tiny musical note in gold ornament, sparkling melody enchantment.

### art

ART: rich TURQUOISE leather magic book with iridescent multicolored jewels in the ornate gold corners, large central golden PAINTER PALETTE with five tiny colorful gems for paint and a diagonal ornate paintbrush. Rainbow creative magic.

