import { TournamentData, Team, Match, KnockoutTie, GrandFinal } from '../types/tournament';

export const DEFAULT_TEAMS: Team[] = [
  // Pot 1 (5 teams)
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BAR',
    pot: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/200px-FC_Barcelona_%28crest%29.svg.png',
    primaryColor: '#004D98',
    secondaryColor: '#A50044',
    stadium: 'Spotify Camp Nou',
    roster: [
      { id: 'bar-1', name: 'Marc-André ter Stegen', teamId: 'barcelona', number: 1, position: 'GK' },
      { id: 'bar-2', name: 'Pau Cubarsí', teamId: 'barcelona', number: 2, position: 'DEF' },
      { id: 'bar-3', name: 'Jules Koundé', teamId: 'barcelona', number: 23, position: 'DEF' },
      { id: 'bar-4', name: 'Pedri', teamId: 'barcelona', number: 8, position: 'MID' },
      { id: 'bar-5', name: 'Gavi', teamId: 'barcelona', number: 6, position: 'MID' },
      { id: 'bar-6', name: 'Dani Olmo', teamId: 'barcelona', number: 20, position: 'MID' },
      { id: 'bar-7', name: 'Lamine Yamal', teamId: 'barcelona', number: 19, position: 'FWD' },
      { id: 'bar-8', name: 'Robert Lewandowski', teamId: 'barcelona', number: 9, position: 'FWD' },
      { id: 'bar-9', name: 'Raphinha', teamId: 'barcelona', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'dortmund',
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    pot: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/200px-Borussia_Dortmund_logo.svg.png',
    primaryColor: '#FDE100',
    secondaryColor: '#000000',
    stadium: 'Signal Iduna Park',
    roster: [
      { id: 'bvb-1', name: 'Gregor Kobel', teamId: 'dortmund', number: 1, position: 'GK' },
      { id: 'bvb-2', name: 'Nico Schlotterbeck', teamId: 'dortmund', number: 4, position: 'DEF' },
      { id: 'bvb-3', name: 'Waldemar Anton', teamId: 'dortmund', number: 3, position: 'DEF' },
      { id: 'bvb-4', name: 'Julian Brandt', teamId: 'dortmund', number: 10, position: 'MID' },
      { id: 'bvb-5', name: 'Marcel Sabitzer', teamId: 'dortmund', number: 20, position: 'MID' },
      { id: 'bvb-6', name: 'Felix Nmecha', teamId: 'dortmund', number: 8, position: 'MID' },
      { id: 'bvb-7', name: 'Karim Adeyemi', teamId: 'dortmund', number: 27, position: 'FWD' },
      { id: 'bvb-8', name: 'Serhou Guirassy', teamId: 'dortmund', number: 9, position: 'FWD' },
      { id: 'bvb-9', name: 'Donyell Malen', teamId: 'dortmund', number: 21, position: 'FWD' },
    ],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    pot: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/200px-Arsenal_FC.svg.png',
    primaryColor: '#EF0107',
    secondaryColor: '#063672',
    stadium: 'Emirates Stadium',
    roster: [
      { id: 'ars-1', name: 'David Raya', teamId: 'arsenal', number: 22, position: 'GK' },
      { id: 'ars-2', name: 'William Saliba', teamId: 'arsenal', number: 2, position: 'DEF' },
      { id: 'ars-3', name: 'Gabriel Magalhães', teamId: 'arsenal', number: 6, position: 'DEF' },
      { id: 'ars-4', name: 'Declan Rice', teamId: 'arsenal', number: 41, position: 'MID' },
      { id: 'ars-5', name: 'Martin Ødegaard', teamId: 'arsenal', number: 8, position: 'MID' },
      { id: 'ars-6', name: 'Mikel Merino', teamId: 'arsenal', number: 23, position: 'MID' },
      { id: 'ars-7', name: 'Bukayo Saka', teamId: 'arsenal', number: 7, position: 'FWD' },
      { id: 'ars-8', name: 'Kai Havertz', teamId: 'arsenal', number: 29, position: 'FWD' },
      { id: 'ars-9', name: 'Gabriel Martinelli', teamId: 'arsenal', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'mancity',
    name: 'Manchester City',
    shortName: 'MCI',
    pot: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/200px-Manchester_City_FC_badge.svg.png',
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    stadium: 'Etihad Stadium',
    roster: [
      { id: 'mci-1', name: 'Ederson', teamId: 'mancity', number: 31, position: 'GK' },
      { id: 'mci-2', name: 'Rúben Dias', teamId: 'mancity', number: 3, position: 'DEF' },
      { id: 'mci-3', name: 'Joško Gvardiol', teamId: 'mancity', number: 24, position: 'DEF' },
      { id: 'mci-4', name: 'Rodri', teamId: 'mancity', number: 16, position: 'MID' },
      { id: 'mci-5', name: 'Kevin De Bruyne', teamId: 'mancity', number: 17, position: 'MID' },
      { id: 'mci-6', name: 'Bernardo Silva', teamId: 'mancity', number: 20, position: 'MID' },
      { id: 'mci-7', name: 'Phil Foden', teamId: 'mancity', number: 47, position: 'FWD' },
      { id: 'mci-8', name: 'Erling Haaland', teamId: 'mancity', number: 9, position: 'FWD' },
      { id: 'mci-9', name: 'Jeremy Doku', teamId: 'mancity', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'roma',
    name: 'AS Roma',
    shortName: 'ROM',
    pot: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/200px-AS_Roma_logo_%282017%29.svg.png',
    primaryColor: '#8E1F2F',
    secondaryColor: '#F0BC42',
    stadium: 'Stadio Olimpico',
    roster: [
      { id: 'rom-1', name: 'Mile Svilar', teamId: 'roma', number: 99, position: 'GK' },
      { id: 'rom-2', name: 'Gianluca Mancini', teamId: 'roma', number: 23, position: 'DEF' },
      { id: 'rom-3', name: 'Evan Ndicka', teamId: 'roma', number: 5, position: 'DEF' },
      { id: 'rom-4', name: 'Bryan Cristante', teamId: 'roma', number: 4, position: 'MID' },
      { id: 'rom-5', name: 'Lorenzo Pellegrini', teamId: 'roma', number: 7, position: 'MID' },
      { id: 'rom-6', name: 'Manu Koné', teamId: 'roma', number: 17, position: 'MID' },
      { id: 'rom-7', name: 'Paulo Dybala', teamId: 'roma', number: 21, position: 'FWD' },
      { id: 'rom-8', name: 'Artem Dovbyk', teamId: 'roma', number: 11, position: 'FWD' },
      { id: 'rom-9', name: 'Matías Soulé', teamId: 'roma', number: 18, position: 'FWD' },
    ],
  },

  // Pot 2 (4 teams)
  {
    id: 'realmadrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    pot: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png',
    primaryColor: '#EEEEEF',
    secondaryColor: '#00529F',
    stadium: 'Santiago Bernabéu',
    roster: [
      { id: 'rma-1', name: 'Thibaut Courtois', teamId: 'realmadrid', number: 1, position: 'GK' },
      { id: 'rma-2', name: 'Antonio Rüdiger', teamId: 'realmadrid', number: 22, position: 'DEF' },
      { id: 'rma-3', name: 'Éder Militão', teamId: 'realmadrid', number: 3, position: 'DEF' },
      { id: 'rma-4', name: 'Jude Bellingham', teamId: 'realmadrid', number: 5, position: 'MID' },
      { id: 'rma-5', name: 'Federico Valverde', teamId: 'realmadrid', number: 8, position: 'MID' },
      { id: 'rma-6', name: 'Luka Modrić', teamId: 'realmadrid', number: 10, position: 'MID' },
      { id: 'rma-7', name: 'Vinícius Júnior', teamId: 'realmadrid', number: 7, position: 'FWD' },
      { id: 'rma-8', name: 'Kylian Mbappé', teamId: 'realmadrid', number: 9, position: 'FWD' },
      { id: 'rma-9', name: 'Rodrygo', teamId: 'realmadrid', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'manutd',
    name: 'Manchester United',
    shortName: 'MUN',
    pot: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/200px-Manchester_United_FC_crest.svg.png',
    primaryColor: '#DA291C',
    secondaryColor: '#FBE122',
    stadium: 'Old Trafford',
    roster: [
      { id: 'mun-1', name: 'André Onana', teamId: 'manutd', number: 24, position: 'GK' },
      { id: 'mun-2', name: 'Matthijs de Ligt', teamId: 'manutd', number: 4, position: 'DEF' },
      { id: 'mun-3', name: 'Lisandro Martínez', teamId: 'manutd', number: 6, position: 'DEF' },
      { id: 'mun-4', name: 'Bruno Fernandes', teamId: 'manutd', number: 8, position: 'MID' },
      { id: 'mun-5', name: 'Kobbie Mainoo', teamId: 'manutd', number: 37, position: 'MID' },
      { id: 'mun-6', name: 'Manuel Ugarte', teamId: 'manutd', number: 25, position: 'MID' },
      { id: 'mun-7', name: 'Alejandro Garnacho', teamId: 'manutd', number: 17, position: 'FWD' },
      { id: 'mun-8', name: 'Rasmus Højlund', teamId: 'manutd', number: 9, position: 'FWD' },
      { id: 'mun-9', name: 'Marcus Rashford', teamId: 'manutd', number: 10, position: 'FWD' },
    ],
  },
  {
    id: 'acmilan',
    name: 'AC Milan',
    shortName: 'MIL',
    pot: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/200px-Logo_of_AC_Milan.svg.png',
    primaryColor: '#FB090B',
    secondaryColor: '#000000',
    stadium: 'San Siro',
    roster: [
      { id: 'mil-1', name: 'Mike Maignan', teamId: 'acmilan', number: 16, position: 'GK' },
      { id: 'mil-2', name: 'Théo Hernandez', teamId: 'acmilan', number: 19, position: 'DEF' },
      { id: 'mil-3', name: 'Fikayo Tomori', teamId: 'acmilan', number: 23, position: 'DEF' },
      { id: 'mil-4', name: 'Tijjani Reijnders', teamId: 'acmilan', number: 14, position: 'MID' },
      { id: 'mil-5', name: 'Youssouf Fofana', teamId: 'acmilan', number: 29, position: 'MID' },
      { id: 'mil-6', name: 'Ruben Loftus-Cheek', teamId: 'acmilan', number: 8, position: 'MID' },
      { id: 'mil-7', name: 'Christian Pulisic', teamId: 'acmilan', number: 11, position: 'FWD' },
      { id: 'mil-8', name: 'Rafael Leão', teamId: 'acmilan', number: 10, position: 'FWD' },
      { id: 'mil-9', name: 'Álvaro Morata', teamId: 'acmilan', number: 7, position: 'FWD' },
    ],
  },
  {
    id: 'napoli',
    name: 'Napoli',
    shortName: 'NAP',
    pot: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/SSC_Napoli_2024_%28deep_blue_silhouette%29.svg/200px-SSC_Napoli_2024_%28deep_blue_silhouette%29.svg.png',
    primaryColor: '#003E84',
    secondaryColor: '#12A0D7',
    stadium: 'Stadio Diego Armando Maradona',
    roster: [
      { id: 'nap-1', name: 'Alex Meret', teamId: 'napoli', number: 1, position: 'GK' },
      { id: 'nap-2', name: 'Alessandro Buongiorno', teamId: 'napoli', number: 4, position: 'DEF' },
      { id: 'nap-3', name: 'Giovanni Di Lorenzo', teamId: 'napoli', number: 22, position: 'DEF' },
      { id: 'nap-4', name: 'Stanislav Lobotka', teamId: 'napoli', number: 68, position: 'MID' },
      { id: 'nap-5', name: 'Frank Anguissa', teamId: 'napoli', number: 99, position: 'MID' },
      { id: 'nap-6', name: 'Scott McTominay', teamId: 'napoli', number: 8, position: 'MID' },
      { id: 'nap-7', name: 'Matteo Politano', teamId: 'napoli', number: 21, position: 'FWD' },
      { id: 'nap-8', name: 'Romelu Lukaku', teamId: 'napoli', number: 11, position: 'FWD' },
      { id: 'nap-9', name: 'Khvicha Kvaratskhelia', teamId: 'napoli', number: 77, position: 'FWD' },
    ],
  },

  // Pot 3 (5 teams)
  {
    id: 'atletico',
    name: 'Atlético Madrid',
    shortName: 'ATM',
    pot: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/200px-Atletico_Madrid_2017_logo.svg.png',
    primaryColor: '#CB3524',
    secondaryColor: '#272E61',
    stadium: 'Cívitas Metropolitano',
    roster: [
      { id: 'atm-1', name: 'Jan Oblak', teamId: 'atletico', number: 13, position: 'GK' },
      { id: 'atm-2', name: 'José María Giménez', teamId: 'atletico', number: 2, position: 'DEF' },
      { id: 'atm-3', name: 'Robin Le Normand', teamId: 'atletico', number: 24, position: 'DEF' },
      { id: 'atm-4', name: 'Koke', teamId: 'atletico', number: 6, position: 'MID' },
      { id: 'atm-5', name: 'Rodrigo De Paul', teamId: 'atletico', number: 5, position: 'MID' },
      { id: 'atm-6', name: 'Conor Gallagher', teamId: 'atletico', number: 4, position: 'MID' },
      { id: 'atm-7', name: 'Antoine Griezmann', teamId: 'atletico', number: 7, position: 'FWD' },
      { id: 'atm-8', name: 'Julián Alvarez', teamId: 'atletico', number: 19, position: 'FWD' },
      { id: 'atm-9', name: 'Alexander Sørloth', teamId: 'atletico', number: 9, position: 'FWD' },
    ],
  },
  {
    id: 'juventus',
    name: 'Juventus',
    shortName: 'JUV',
    pot: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon_%28black%29.svg/200px-Juventus_FC_2017_icon_%28black%29.svg.png',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    stadium: 'Allianz Stadium (Turin)',
    roster: [
      { id: 'juv-1', name: 'Michele Di Gregorio', teamId: 'juventus', number: 29, position: 'GK' },
      { id: 'juv-2', name: 'Bremer', teamId: 'juventus', number: 3, position: 'DEF' },
      { id: 'juv-3', name: 'Federico Gatti', teamId: 'juventus', number: 4, position: 'DEF' },
      { id: 'juv-4', name: 'Manuel Locatelli', teamId: 'juventus', number: 5, position: 'MID' },
      { id: 'juv-5', name: 'Teun Koopmeiners', teamId: 'juventus', number: 8, position: 'MID' },
      { id: 'juv-6', name: 'Douglas Luiz', teamId: 'juventus', number: 26, position: 'MID' },
      { id: 'juv-7', name: 'Kenan Yıldız', teamId: 'juventus', number: 10, position: 'FWD' },
      { id: 'juv-8', name: 'Dušan Vlahović', teamId: 'juventus', number: 9, position: 'FWD' },
      { id: 'juv-9', name: 'Nicolás González', teamId: 'juventus', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    pot: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/200px-Liverpool_FC.svg.png',
    primaryColor: '#C8102E',
    secondaryColor: '#00B2A9',
    stadium: 'Anfield',
    roster: [
      { id: 'liv-1', name: 'Alisson Becker', teamId: 'liverpool', number: 1, position: 'GK' },
      { id: 'liv-2', name: 'Virgil van Dijk', teamId: 'liverpool', number: 4, position: 'DEF' },
      { id: 'liv-3', name: 'Trent Alexander-Arnold', teamId: 'liverpool', number: 66, position: 'DEF' },
      { id: 'liv-4', name: 'Alexis Mac Allister', teamId: 'liverpool', number: 10, position: 'MID' },
      { id: 'liv-5', name: 'Ryan Gravenberch', teamId: 'liverpool', number: 38, position: 'MID' },
      { id: 'liv-6', name: 'Dominik Szoboszlai', teamId: 'liverpool', number: 8, position: 'MID' },
      { id: 'liv-7', name: 'Mohamed Salah', teamId: 'liverpool', number: 11, position: 'FWD' },
      { id: 'liv-8', name: 'Luis Díaz', teamId: 'liverpool', number: 7, position: 'FWD' },
      { id: 'liv-9', name: 'Darwin Núñez', teamId: 'liverpool', number: 9, position: 'FWD' },
    ],
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    shortName: 'CHE',
    pot: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/200px-Chelsea_FC.svg.png',
    primaryColor: '#034694',
    secondaryColor: '#EE242C',
    stadium: 'Stamford Bridge',
    roster: [
      { id: 'che-1', name: 'Robert Sánchez', teamId: 'chelsea', number: 1, position: 'GK' },
      { id: 'che-2', name: 'Levi Colwill', teamId: 'chelsea', number: 6, position: 'DEF' },
      { id: 'che-3', name: 'Marc Cucurella', teamId: 'chelsea', number: 3, position: 'DEF' },
      { id: 'che-4', name: 'Moisés Caicedo', teamId: 'chelsea', number: 25, position: 'MID' },
      { id: 'che-5', name: 'Enzo Fernández', teamId: 'chelsea', number: 8, position: 'MID' },
      { id: 'che-6', name: 'Cole Palmer', teamId: 'chelsea', number: 20, position: 'MID' },
      { id: 'che-7', name: 'Nicolas Jackson', teamId: 'chelsea', number: 15, position: 'FWD' },
      { id: 'che-8', name: 'Christopher Nkunku', teamId: 'chelsea', number: 18, position: 'FWD' },
      { id: 'che-9', name: 'Noni Madueke', teamId: 'chelsea', number: 11, position: 'FWD' },
    ],
  },
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    pot: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/200px-Paris_Saint-Germain_F.C..svg.png',
    primaryColor: '#004170',
    secondaryColor: '#DA291C',
    stadium: 'Parc des Princes',
    roster: [
      { id: 'psg-1', name: 'Gianluigi Donnarumma', teamId: 'psg', number: 1, position: 'GK' },
      { id: 'psg-2', name: 'Marquinhos', teamId: 'psg', number: 5, position: 'DEF' },
      { id: 'psg-3', name: 'Achraf Hakimi', teamId: 'psg', number: 2, position: 'DEF' },
      { id: 'psg-4', name: 'Vitinha', teamId: 'psg', number: 17, position: 'MID' },
      { id: 'psg-5', name: 'Warren Zaïre-Emery', teamId: 'psg', number: 33, position: 'MID' },
      { id: 'psg-6', name: 'João Neves', teamId: 'psg', number: 87, position: 'MID' },
      { id: 'psg-7', name: 'Ousmane Dembélé', teamId: 'psg', number: 10, position: 'FWD' },
      { id: 'psg-8', name: 'Bradley Barcola', teamId: 'psg', number: 29, position: 'FWD' },
      { id: 'psg-9', name: 'Randal Kolo Muani', teamId: 'psg', number: 23, position: 'FWD' },
    ],
  },
];

// 42 Matches blueprint: 11 matchdays (9 matchdays of 4 matches, 2 matchdays of 3 matches)
// Perfectly reciprocal balance: each team plays 6 matches (3 home, 3 away)
const RAW_FIXTURES: { matchday: number; home: string; away: string }[] = [
  // Matchday 1
  { matchday: 1, home: 'mancity', away: 'chelsea' },
  { matchday: 1, home: 'arsenal', away: 'psg' },
  { matchday: 1, home: 'dortmund', away: 'juventus' },
  { matchday: 1, home: 'roma', away: 'acmilan' },

  // Matchday 2
  { matchday: 2, home: 'chelsea', away: 'napoli' },
  { matchday: 2, home: 'realmadrid', away: 'roma' },
  { matchday: 2, home: 'atletico', away: 'liverpool' },
  { matchday: 2, home: 'psg', away: 'barcelona' },

  // Matchday 3
  { matchday: 3, home: 'atletico', away: 'juventus' },
  { matchday: 3, home: 'napoli', away: 'arsenal' },
  { matchday: 3, home: 'manutd', away: 'chelsea' },
  { matchday: 3, home: 'liverpool', away: 'realmadrid' },

  // Matchday 4
  { matchday: 4, home: 'dortmund', away: 'roma' },
  { matchday: 4, home: 'mancity', away: 'manutd' },
  { matchday: 4, home: 'liverpool', away: 'barcelona' },
  { matchday: 4, home: 'acmilan', away: 'atletico' },

  // Matchday 5
  { matchday: 5, home: 'mancity', away: 'realmadrid' },
  { matchday: 5, home: 'juventus', away: 'liverpool' },
  { matchday: 5, home: 'manutd', away: 'psg' },
  { matchday: 5, home: 'napoli', away: 'dortmund' },

  // Matchday 6
  { matchday: 6, home: 'napoli', away: 'realmadrid' },
  { matchday: 6, home: 'roma', away: 'arsenal' },
  { matchday: 6, home: 'barcelona', away: 'chelsea' },
  { matchday: 6, home: 'acmilan', away: 'juventus' },

  // Matchday 7
  { matchday: 7, home: 'arsenal', away: 'dortmund' },
  { matchday: 7, home: 'psg', away: 'acmilan' },
  { matchday: 7, home: 'manutd', away: 'atletico' },
  { matchday: 7, home: 'barcelona', away: 'napoli' },

  // Matchday 8
  { matchday: 8, home: 'dortmund', away: 'psg' },
  { matchday: 8, home: 'atletico', away: 'napoli' },
  { matchday: 8, home: 'arsenal', away: 'acmilan' },
  { matchday: 8, home: 'barcelona', away: 'mancity' },

  // Matchday 9
  { matchday: 9, home: 'liverpool', away: 'arsenal' },
  { matchday: 9, home: 'realmadrid', away: 'barcelona' },
  { matchday: 9, home: 'chelsea', away: 'atletico' },
  { matchday: 9, home: 'juventus', away: 'mancity' },

  // Matchday 10
  { matchday: 10, home: 'psg', away: 'liverpool' },
  { matchday: 10, home: 'acmilan', away: 'manutd' },
  { matchday: 10, home: 'juventus', away: 'roma' },

  // Matchday 11
  { matchday: 11, home: 'realmadrid', away: 'manutd' },
  { matchday: 11, home: 'chelsea', away: 'dortmund' },
  { matchday: 11, home: 'roma', away: 'mancity' },
];

export const INITIAL_MATCHES: Match[] = RAW_FIXTURES.map((item, idx) => {
  const homeTeam = DEFAULT_TEAMS.find(t => t.id === item.home);
  return {
    id: `m-${idx + 1}`,
    matchday: item.matchday,
    homeTeamId: item.home,
    awayTeamId: item.away,
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    events: [],
    venue: homeTeam?.stadium || 'UEFA Stadium',
    dateLabel: `Matchday ${item.matchday}`,
  };
});

// Seed Matchday 1 & 2 with thrilling initial results so users can see live stats right away!
export const SEED_SAMPLE_RESULTS = (matches: Match[], teams: Team[]): Match[] => {
  const getPlayer = (teamId: string, namePart: string) => {
    const t = teams.find(team => team.id === teamId);
    return t?.roster.find(p => p.name.toLowerCase().includes(namePart.toLowerCase())) || t?.roster[0];
  };

  return matches.map(m => {
    // Match 1: Man City 3 - 1 Chelsea
    if (m.id === 'm-1') {
      const haaland = getPlayer('mancity', 'haaland');
      const foden = getPlayer('mancity', 'foden');
      const kdb = getPlayer('mancity', 'bruyne');
      const palmer = getPlayer('chelsea', 'palmer');
      const ederson = getPlayer('mancity', 'ederson');
      const sanchez = getPlayer('chelsea', 'sanchez');
      return {
        ...m,
        status: 'completed',
        homeScore: 3,
        awayScore: 1,
        motmPlayerId: haaland?.id,
        events: [
          { id: 'ev-1', matchId: m.id, type: 'goal', minute: 18, playerId: haaland?.id || '', playerName: haaland?.name || 'Erling Haaland', teamId: 'mancity', assistPlayerId: kdb?.id, assistPlayerName: kdb?.name },
          { id: 'ev-2', matchId: m.id, type: 'goal', minute: 34, playerId: palmer?.id || '', playerName: palmer?.name || 'Cole Palmer', teamId: 'chelsea' },
          { id: 'ev-3', matchId: m.id, type: 'goal', minute: 58, playerId: foden?.id || '', playerName: foden?.name || 'Phil Foden', teamId: 'mancity', assistPlayerId: kdb?.id, assistPlayerName: kdb?.name },
          { id: 'ev-4', matchId: m.id, type: 'goal', minute: 82, playerId: haaland?.id || '', playerName: haaland?.name || 'Erling Haaland', teamId: 'mancity' },
          { id: 'ev-5', matchId: m.id, type: 'save', minute: 40, playerId: ederson?.id || '', playerName: ederson?.name || 'Ederson', teamId: 'mancity', detail: '4 saves' },
          { id: 'ev-6', matchId: m.id, type: 'save', minute: 65, playerId: sanchez?.id || '', playerName: sanchez?.name || 'Robert Sánchez', teamId: 'chelsea', detail: '6 saves' },
          { id: 'ev-7', matchId: m.id, type: 'yellow_card', minute: 71, playerId: palmer?.id || '', playerName: palmer?.name || 'Cole Palmer', teamId: 'chelsea' },
        ],
      };
    }

    // Match 2: Arsenal 2 - 2 PSG
    if (m.id === 'm-2') {
      const saka = getPlayer('arsenal', 'saka');
      const odegaard = getPlayer('arsenal', 'odegaard');
      const dembele = getPlayer('psg', 'dembélé');
      const barcola = getPlayer('psg', 'barcola');
      const raya = getPlayer('arsenal', 'raya');
      const donna = getPlayer('psg', 'donnarumma');
      return {
        ...m,
        status: 'completed',
        homeScore: 2,
        awayScore: 2,
        motmPlayerId: saka?.id,
        events: [
          { id: 'ev-8', matchId: m.id, type: 'goal', minute: 12, playerId: saka?.id || '', playerName: saka?.name || 'Bukayo Saka', teamId: 'arsenal', assistPlayerId: odegaard?.id, assistPlayerName: odegaard?.name },
          { id: 'ev-9', matchId: m.id, type: 'goal', minute: 29, playerId: barcola?.id || '', playerName: barcola?.name || 'Bradley Barcola', teamId: 'psg', assistPlayerId: dembele?.id, assistPlayerName: dembele?.name },
          { id: 'ev-10', matchId: m.id, type: 'goal', minute: 61, playerId: dembele?.id || '', playerName: dembele?.name || 'Ousmane Dembélé', teamId: 'psg' },
          { id: 'ev-11', matchId: m.id, type: 'goal', minute: 88, playerId: odegaard?.id || '', playerName: odegaard?.name || 'Martin Ødegaard', teamId: 'arsenal' },
          { id: 'ev-12', matchId: m.id, type: 'save', minute: 50, playerId: raya?.id || '', playerName: raya?.name || 'David Raya', teamId: 'arsenal', detail: '5 saves' },
          { id: 'ev-13', matchId: m.id, type: 'save', minute: 75, playerId: donna?.id || '', playerName: donna?.name || 'Gianluigi Donnarumma', teamId: 'psg', detail: '4 saves' },
          { id: 'ev-14', matchId: m.id, type: 'yellow_card', minute: 79, playerId: odegaard?.id || '', playerName: odegaard?.name || 'Martin Ødegaard', teamId: 'arsenal' },
        ],
      };
    }

    // Match 3: Dortmund 2 - 1 Juventus
    if (m.id === 'm-3') {
      const guirassy = getPlayer('dortmund', 'guirassy');
      const brandt = getPlayer('dortmund', 'brandt');
      const vlahovic = getPlayer('juventus', 'vlahović');
      const kobel = getPlayer('dortmund', 'kobel');
      return {
        ...m,
        status: 'completed',
        homeScore: 2,
        awayScore: 1,
        motmPlayerId: guirassy?.id,
        events: [
          { id: 'ev-15', matchId: m.id, type: 'goal', minute: 22, playerId: guirassy?.id || '', playerName: guirassy?.name || 'Serhou Guirassy', teamId: 'dortmund', assistPlayerId: brandt?.id, assistPlayerName: brandt?.name },
          { id: 'ev-16', matchId: m.id, type: 'goal', minute: 49, playerId: vlahovic?.id || '', playerName: vlahovic?.name || 'Dušan Vlahović', teamId: 'juventus' },
          { id: 'ev-17', matchId: m.id, type: 'goal', minute: 74, playerId: guirassy?.id || '', playerName: guirassy?.name || 'Serhou Guirassy', teamId: 'dortmund' },
          { id: 'ev-18', matchId: m.id, type: 'save', minute: 85, playerId: kobel?.id || '', playerName: kobel?.name || 'Gregor Kobel', teamId: 'dortmund', detail: '4 saves' },
          { id: 'ev-19', matchId: m.id, type: 'yellow_card', minute: 31, playerId: brandt?.id || '', playerName: brandt?.name || 'Julian Brandt', teamId: 'dortmund' },
        ],
      };
    }

    // Match 4: Roma 1 - 0 AC Milan
    if (m.id === 'm-4') {
      const dybala = getPlayer('roma', 'dybala');
      const svilar = getPlayer('roma', 'svilar');
      return {
        ...m,
        status: 'completed',
        homeScore: 1,
        awayScore: 0,
        motmPlayerId: dybala?.id,
        events: [
          { id: 'ev-20', matchId: m.id, type: 'goal', minute: 67, playerId: dybala?.id || '', playerName: dybala?.name || 'Paulo Dybala', teamId: 'roma', isPenalty: true },
          { id: 'ev-21', matchId: m.id, type: 'save', minute: 77, playerId: svilar?.id || '', playerName: svilar?.name || 'Mile Svilar', teamId: 'roma', detail: '6 saves' },
          { id: 'ev-22', matchId: m.id, type: 'yellow_card', minute: 66, playerId: dybala?.id || '', playerName: dybala?.name || 'Paulo Dybala', teamId: 'roma' },
        ],
      };
    }

    return m;
  });
};

export const INITIAL_KNOCKOUT_TIES: KnockoutTie[] = [
  // 4 Play-off ties (5th to 12th in league phase standings)
  {
    id: 'po-1',
    stage: 'playoff',
    tieNumber: 1,
    name: 'Play-off Tie 1 (5th vs 12th)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'po-2',
    stage: 'playoff',
    tieNumber: 2,
    name: 'Play-off Tie 2 (6th vs 11th)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'po-3',
    stage: 'playoff',
    tieNumber: 3,
    name: 'Play-off Tie 3 (7th vs 10th)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'po-4',
    stage: 'playoff',
    tieNumber: 4,
    name: 'Play-off Tie 4 (8th vs 9th)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },

  // 4 Quarterfinal ties (Top 4 seeds vs Play-off winners)
  {
    id: 'qf-1',
    stage: 'quarterfinal',
    tieNumber: 1,
    name: 'Quarterfinal 1 (1st vs Winner PO 4)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'qf-2',
    stage: 'quarterfinal',
    tieNumber: 2,
    name: 'Quarterfinal 2 (2nd vs Winner PO 3)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'qf-3',
    stage: 'quarterfinal',
    tieNumber: 3,
    name: 'Quarterfinal 3 (3rd vs Winner PO 2)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'qf-4',
    stage: 'quarterfinal',
    tieNumber: 4,
    name: 'Quarterfinal 4 (4th vs Winner PO 1)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },

  // 2 Semifinals ties
  {
    id: 'sf-1',
    stage: 'semifinal',
    tieNumber: 1,
    name: 'Semifinal 1 (Winner QF 1 vs Winner QF 4)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
  {
    id: 'sf-2',
    stage: 'semifinal',
    tieNumber: 2,
    name: 'Semifinal 2 (Winner QF 2 vs Winner QF 3)',
    teamAId: null,
    teamBId: null,
    leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
    leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
  },
];

export const INITIAL_GRAND_FINAL: GrandFinal = {
  id: 'ucl-final',
  teamAId: null,
  teamBId: null,
  regularHomeScore: null,
  regularAwayScore: null,
  extraTime: false,
  etHomeScore: null,
  etAwayScore: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerTeamId: null,
  status: 'scheduled',
  venue: 'Allianz Arena, Munich',
  events: [],
};

export const INITIAL_TOURNAMENT_DATA: TournamentData = {
  version: 3,
  tournamentName: 'Unemployed Champions League (UCL)',
  season: 'Season 3',
  teams: DEFAULT_TEAMS,
  matches: SEED_SAMPLE_RESULTS(INITIAL_MATCHES, DEFAULT_TEAMS),
  knockoutTies: INITIAL_KNOCKOUT_TIES,
  grandFinal: INITIAL_GRAND_FINAL,
  lastUpdated: new Date().toISOString(),
};
