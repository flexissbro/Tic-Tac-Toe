# Piškvorky (Tic-tac-toe)

Jednoduchá implementace hry Piškvorky (Tic-tac-toe) pomocí HTML, CSS a JavaScriptu s možností online hraní.

## Funkce

- Hrací plocha 3x3
- Střídání hráčů (X a O)
- Detekce vítěze
- Detekce remízy
- Možnost restartu hry
- Responzivní design
- Online multiplayer
- Systém herních místností

## Jak hrát lokálně

1. Otevřete soubor `index.html` ve webovém prohlížeči
2. Hráči se střídají v klikání na prázdná pole
3. Cílem je vytvořit řadu tří stejných symbolů (horizontálně, vertikálně nebo diagonálně)
4. Hra končí, když jeden z hráčů vyhraje nebo dojde k remíze
5. Pro novou hru klikněte na tlačítko "Restart hry"

## Jak hrát online

1. Nainstalujte závislosti:
   ```bash
   npm install
   ```

2. Spusťte server:
   ```bash
   npm start
   ```

3. Pro hru přes internet použijte službu jako ngrok:
   ```bash
   ngrok http 3000
   ```

4. První hráč:
   - Otevře vygenerovanou URL
   - Klikne na "Vytvořit novou hru"
   - Pošle vygenerovaný kód místnosti druhému hráči

5. Druhý hráč:
   - Otevře stejnou URL
   - Zadá kód místnosti
   - Klikne na "Připojit se do hry"

## Technologie

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express
- Socket.IO

## Struktura projektu

- `index.html` - Základní struktura hry
- `style.css` - Styly a vzhled
- `script.js` - Herní logika a funkcionalita
- `server.js` - Server pro online multiplayer
- `package.json` - Správa závislostí a skripty

## Instalace a spuštění

```bash
# Klonování repozitáře
git clone https://github.com/flexissbro/Tic-Tac-Toe.git

# Přejít do složky projektu
cd Tic-Tac-Toe

# Instalace závislostí
npm install

# Spuštění serveru
npm start
```