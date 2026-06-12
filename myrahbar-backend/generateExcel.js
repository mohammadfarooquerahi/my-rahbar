const xlsx = require("xlsx");
const fs = require("fs");

// Helper to create departments string
const depts = (items) => items.map(d => `${d.name},${d.seats},${d.fee},${d.merit}`).join(" | ");

// Core universities with realistic data
const universities = [
  {
    "University Name": "National University of Sciences and Technology",
    "Short Name": "NUST",
    "Type": "government",
    "City": "Islamabad",
    "Website": "nust.edu.pk",
    "Established": 1991,
    "Admission Open": "TRUE",
    "Admission Fee": 35000,
    "Test Type": "NET",
    "Matric %": 0.1,
    "FSc %": 0.15,
    "Test %": 0.75,
    "Hostel": "TRUE",
    "Hostel Fee": 15000,
    "Scholarships": "NUST Need Based, HEC Ehsaas",
    "Required Documents": "Matric, FSc, CNIC, Photos, Domicile",
    "Departments": depts([
      { name: "BS Computer Science", seats: 120, fee: 125000, merit: 82.5 },
      { name: "BS Software Engineering", seats: 100, fee: 125000, merit: 81.0 },
      { name: "BE Mechanical", seats: 150, fee: 110000, merit: 78.5 },
      { name: "BBA", seats: 120, fee: 130000, merit: 75.0 }
    ])
  },
  {
    "University Name": "National University of Computer and Emerging Sciences",
    "Short Name": "FAST NUCES",
    "Type": "private",
    "City": "Multiple (Lahore, Karachi, Islamabad)",
    "Website": "nu.edu.pk",
    "Established": 2000,
    "Admission Open": "TRUE",
    "Admission Fee": 30000,
    "Test Type": "Own Test",
    "Matric %": 0.1,
    "FSc %": 0.4,
    "Test %": 0.5,
    "Hostel": "FALSE",
    "Hostel Fee": 0,
    "Scholarships": "OSAF, Need Based",
    "Required Documents": "Matric, FSc, CNIC, Admit Card",
    "Departments": depts([
      { name: "BS Computer Science", seats: 300, fee: 140000, merit: 79.5 },
      { name: "BS Software Engineering", seats: 150, fee: 140000, merit: 77.0 },
      { name: "BS Artificial Intelligence", seats: 100, fee: 140000, merit: 76.5 },
      { name: "BBA", seats: 100, fee: 135000, merit: 65.0 }
    ])
  },
  {
    "University Name": "Lahore University of Management Sciences",
    "Short Name": "LUMS",
    "Type": "private",
    "City": "Lahore",
    "Website": "lums.edu.pk",
    "Established": 1985,
    "Admission Open": "TRUE",
    "Admission Fee": 75000,
    "Test Type": "SAT",
    "Matric %": 0.2,
    "FSc %": 0.3,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 25000,
    "Scholarships": "NOP, Merit Based",
    "Required Documents": "O Levels, A Levels, SAT Score, Extracurriculars",
    "Departments": depts([
      { name: "BS Computer Science", seats: 80, fee: 550000, merit: 88.0 },
      { name: "BSc Accounting and Finance", seats: 150, fee: 550000, merit: 85.0 },
      { name: "BSc Economics", seats: 120, fee: 550000, merit: 82.0 },
      { name: "BA LLB", seats: 50, fee: 550000, merit: 86.0 }
    ])
  },
  {
    "University Name": "University of Engineering and Technology",
    "Short Name": "UET Lahore",
    "Type": "government",
    "City": "Lahore",
    "Website": "uet.edu.pk",
    "Established": 1921,
    "Admission Open": "TRUE",
    "Admission Fee": 25000,
    "Test Type": "ECAT",
    "Matric %": 0.1,
    "FSc %": 0.2,
    "Test %": 0.7,
    "Hostel": "TRUE",
    "Hostel Fee": 8000,
    "Scholarships": "PEEF, HEC Need Based",
    "Required Documents": "Matric, FSc, Domicile, ECAT Result",
    "Departments": depts([
      { name: "BSc Electrical Engineering", seats: 200, fee: 45000, merit: 78.5 },
      { name: "BSc Mechanical Engineering", seats: 200, fee: 45000, merit: 79.2 },
      { name: "BSc Computer Science", seats: 100, fee: 55000, merit: 82.1 },
      { name: "BSc Civil Engineering", seats: 150, fee: 45000, merit: 77.0 }
    ])
  },
  {
    "University Name": "COMSATS University Islamabad",
    "Short Name": "CUI",
    "Type": "government",
    "City": "Islamabad",
    "Website": "comsats.edu.pk",
    "Established": 1998,
    "Admission Open": "TRUE",
    "Admission Fee": 22000,
    "Test Type": "NTS",
    "Matric %": 0.1,
    "FSc %": 0.4,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 18000,
    "Scholarships": "HEC Need Based, ICT R&D",
    "Required Documents": "Matric, FSc, NTS NAT Result",
    "Departments": depts([
      { name: "BS Computer Science", seats: 400, fee: 110000, merit: 84.5 },
      { name: "BS Software Engineering", seats: 300, fee: 110000, merit: 83.0 },
      { name: "BBA", seats: 200, fee: 95000, merit: 72.0 }
    ])
  },
  {
    "University Name": "NED University of Engineering and Technology",
    "Short Name": "NED",
    "Type": "government",
    "City": "Karachi",
    "Website": "neduet.edu.pk",
    "Established": 1921,
    "Admission Open": "TRUE",
    "Admission Fee": 20000,
    "Test Type": "Own Test",
    "Matric %": 0.1,
    "FSc %": 0.4,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 5000,
    "Scholarships": "Sindh Govt Endowment, Merit",
    "Required Documents": "Matric, FSc, Domicile, PRC",
    "Departments": depts([
      { name: "BE Computer Systems", seats: 150, fee: 35000, merit: 82.0 },
      { name: "BS Computer Science", seats: 100, fee: 35000, merit: 85.5 },
      { name: "BE Mechanical", seats: 200, fee: 35000, merit: 78.0 },
      { name: "BE Civil", seats: 200, fee: 35000, merit: 76.5 }
    ])
  },
  {
    "University Name": "Aga Khan University",
    "Short Name": "AKU",
    "Type": "private",
    "City": "Karachi",
    "Website": "aku.edu",
    "Established": 1983,
    "Admission Open": "FALSE",
    "Admission Fee": 100000,
    "Test Type": "Own Test",
    "Matric %": 0.2,
    "FSc %": 0.3,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 30000,
    "Scholarships": "AKU Need-Blind Financial Aid",
    "Required Documents": "O/A Levels, CNIC, Extracurriculars",
    "Departments": depts([
      { name: "MBBS", seats: 100, fee: 1500000, merit: 92.0 },
      { name: "BSc Nursing", seats: 150, fee: 200000, merit: 75.0 }
    ])
  },
  {
    "University Name": "King Edward Medical University",
    "Short Name": "KEMU",
    "Type": "government",
    "City": "Lahore",
    "Website": "kemu.edu.pk",
    "Established": 1860,
    "Admission Open": "TRUE",
    "Admission Fee": 15000,
    "Test Type": "MDCAT",
    "Matric %": 0.1,
    "FSc %": 0.4,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 8000,
    "Scholarships": "PEEF, HEC Need Based",
    "Required Documents": "Matric, FSc, Domicile, MDCAT Result",
    "Departments": depts([
      { name: "MBBS", seats: 350, fee: 25000, merit: 93.5 },
      { name: "BDS", seats: 100, fee: 25000, merit: 92.0 },
      { name: "DPT", seats: 50, fee: 40000, merit: 90.0 }
    ])
  },
  {
    "University Name": "Institute of Business Administration",
    "Short Name": "IBA",
    "Type": "government",
    "City": "Karachi",
    "Website": "iba.edu.pk",
    "Established": 1955,
    "Admission Open": "TRUE",
    "Admission Fee": 60000,
    "Test Type": "Own Test",
    "Matric %": 0.2,
    "FSc %": 0.3,
    "Test %": 0.5,
    "Hostel": "TRUE",
    "Hostel Fee": 15000,
    "Scholarships": "NTHP, Sindh Endowment",
    "Required Documents": "Matric, FSc, CNIC, Photos",
    "Departments": depts([
      { name: "BBA", seats: 250, fee: 220000, merit: 80.0 },
      { name: "BS Computer Science", seats: 150, fee: 220000, merit: 83.0 },
      { name: "BS Accounting and Finance", seats: 100, fee: 220000, merit: 78.0 },
      { name: "BS Economics", seats: 100, fee: 220000, merit: 75.0 }
    ])
  },
  {
    "University Name": "Quaid-i-Azam University",
    "Short Name": "QAU",
    "Type": "government",
    "City": "Islamabad",
    "Website": "qau.edu.pk",
    "Established": 1967,
    "Admission Open": "TRUE",
    "Admission Fee": 10000,
    "Test Type": "Own Test",
    "Matric %": 0.3,
    "FSc %": 0.7,
    "Test %": 0.0,
    "Hostel": "TRUE",
    "Hostel Fee": 10000,
    "Scholarships": "HEC Need Based",
    "Required Documents": "Matric, FSc, CNIC",
    "Departments": depts([
      { name: "BS Computer Science", seats: 100, fee: 55000, merit: 82.0 },
      { name: "BS International Relations", seats: 80, fee: 45000, merit: 78.0 },
      { name: "BS Physics", seats: 80, fee: 45000, merit: 80.0 },
      { name: "Pharm-D", seats: 100, fee: 75000, merit: 85.0 }
    ])
  }
];

// Helper to generate variations for 100 total
const generateMore = () => {
  const cities = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Rawalpindi"];
  const prefixes = ["University of", "Institute of", "Federal", "Global", "National", "Capital"];
  const suffixes = ["Science & Technology", "Modern Sciences", "Engineering", "Management Sciences", "Health Sciences"];
  
  for (let i = 11; i <= 100; i++) {
    const isGovt = Math.random() > 0.5;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    universities.push({
      "University Name": `${p} ${s} ${city}`,
      "Short Name": `${p.charAt(0)}${s.charAt(0)}${city.charAt(0)}`,
      "Type": isGovt ? "government" : "private",
      "City": city,
      "Website": `${p.charAt(0)}${s.charAt(0).toLowerCase()}${city.toLowerCase()}.edu.pk`,
      "Established": Math.floor(Math.random() * (2020 - 1950 + 1) + 1950),
      "Admission Open": Math.random() > 0.3 ? "TRUE" : "FALSE",
      "Admission Fee": Math.floor(Math.random() * 50000 + 10000),
      "Test Type": ["NTS", "HEC-NAT", "Own Test", "None"][Math.floor(Math.random() * 4)],
      "Matric %": 0.2,
      "FSc %": 0.3,
      "Test %": 0.5,
      "Hostel": Math.random() > 0.3 ? "TRUE" : "FALSE",
      "Hostel Fee": Math.floor(Math.random() * 20000 + 5000),
      "Scholarships": "HEC Need Based",
      "Required Documents": "Matric, FSc, CNIC, Domicile",
      "Departments": depts([
        { name: "BS Computer Science", seats: 100, fee: Math.floor(Math.random() * 100000 + 30000), merit: (Math.random() * 20 + 60).toFixed(1) },
        { name: "BBA", seats: 100, fee: Math.floor(Math.random() * 100000 + 30000), merit: (Math.random() * 20 + 50).toFixed(1) },
        { name: "BS English", seats: 50, fee: Math.floor(Math.random() * 50000 + 20000), merit: (Math.random() * 20 + 50).toFixed(1) }
      ])
    });
  }
}

generateMore();

// Convert to worksheet and write
const ws = xlsx.utils.json_to_sheet(universities);

// Set column widths for better view
ws['!cols'] = [
  {wch: 40}, // Name
  {wch: 15}, // Short Name
  {wch: 15}, // Type
  {wch: 15}, // City
  {wch: 25}, // Website
  {wch: 15}, // Established
  {wch: 15}, // Adm Open
  {wch: 15}, // Adm Fee
  {wch: 15}, // Test Type
  {wch: 10}, {wch: 10}, {wch: 10}, // Weights
  {wch: 10}, // Hostel
  {wch: 15}, // Hostel fee
  {wch: 30}, // Scholarships
  {wch: 40}, // Docs
  {wch: 80}  // Depts
];

const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Universities 2026");

xlsx.writeFile(wb, "Top_100_Universities_2026.xlsx");
console.log("Created Top_100_Universities_2026.xlsx with " + universities.length + " records.");
