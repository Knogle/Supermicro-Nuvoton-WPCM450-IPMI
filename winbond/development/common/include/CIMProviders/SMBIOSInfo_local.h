#ifndef MAX_LOG
#define MAX_LOG 128
#endif
enum ProfileType_e {
	BootConfigSetting = 101,
	BootService, 
	BootServiceCapabilities,
	BootSourceSettings,
	ComputerSystem,
	RegisteredProfile,
	HardwareThread,
	Processor,
	EnabledLogicalElementCapabilities,
	Memory,
	ProcessorCore,
	RedundancySet,
	TimeService,
	SoftwareIdentity,
	SoftwareIdentityResource,
	SystemSpecificCollection,
	ProcessorCapabilities,
}ProfileType;

char *Type[] = {
	"BIOS Structure",
	"System Structure",
	"BaseBoard Structure",
	"System Structure",
	"Processor Structure",
	"Memory Controller Structure",
	"Memory Module Structure",
	"Cache Structure",
	"PortConnector Structure",
	"SystemSlots Structure",
	"OnBoardDevice Structure",
	"OEM String Structure",
	"System Configuration Options Structure",
	"BIOS Language Structure",
	"Group Associations Structure",
	"System Event Log Structure",
	"Physical Memory Array Structure",
	"Memory Device Structure",
	"32Bit Memory Error Structure",
	"Memory Array Mapped Address Structure",
	"Memory Device Mapped Address Structure",
	"Build In Pointing Device Structure",
	"Portable Battery Structure",
	"SystemReset Structure",
	"HW Security Structure",
	"System Power Controls Structure",
	"Voltage Probe Structure",
	"Cooling Device Structure",
	"Temperature Probe Structure",
	"Electrical Current Probe Structure",
	"OutOfBand Remote Access Structure",
	"BIS EntryPoint Structure",
	"System Boot Structure",
	"64Bit Memory Error Structure"
	"Management Device Structure",
	"Management Device Component Structure",
	"Management Device Threshold Data Structure",
	"Memory Channel Structure",
	"IPMI Device Structure",
	"System PowerSupply Structure",
	"Inactive Structure",
	"EndOfTable Structure"
};

char *BiosCharacteristics[] = {
	"<Characteristics>Unknown</Characteristics>",
	"<Characteristics>BIOS Characteristics not supported</Characteristics>",
	"<ISA>ISA is supported</ISA>"
	"<MCA>MCA is supported</MCA>",
	"<EISA>EISA is supported</EISA>",
	"<PCI>PCI is supported</PCI>",
	"<PCMCIA>PCMCIA is supported</PCMCIA>",
	"<PNP>PNP is supported</PNP>",
	"<APM>APM is supported</APM>",
	"<Upgradation>BIOS is upgradable</Upgradation>",
	"<Shadowing>BIOS Shadowing is allowed</Shadowing>",
	"<VL_VESA>VL_VESA is supported</VL_VESA>",
	"<ESCD>ESCD support is available</ESCD>",
	"<CD-BOOT>Boot from CD is supported</CD-BOOT>",
	"<SelectableBoot>Selectable Boot is supported</SelectableBoot>",
	"<Socket>BIOS ROM is Socketed</Socket>",
	"<PCMCIABoot>Boot from PC card(PCMCIA) is supported</PCMCIABoot>",
	"<EDD>EDD Specification is supported<EDD>",
	"<INT13h_20>INT13h - Japanese Floppy for NEC 9800 1.2mb is supported</INT13h_20>",
	"<INT13h_21>INT13h - Japanese Floppy for Toshiba 1.2mb is supported</INT13h_21>",
	"<INT13h_22>INT13h - 5.25*/360 KB Floppy services are supported</INT13h_22>",
	"<INT13h_23>INT13h - 5.25*/1.2 MB Floppy services are supported</INT13h_23>",
	"<INT13h_24>INT13h - 3.5*/720 KB Fl0ppy services are supported</INT13h_24>",
	"<INT13h_25>INT13h - 3.5*/2.88MB Floppy services are supported</INT13h_25>",
	"<PrintScreenService>INT5h, Print Screen services is supported</PrintScreenService>",
	"<KeyBoardService>INT9h, 8042 Keyboard services are supported</KeyBoardService>",
	"<SerialService>INT14h, Serial servicres are supported</SerialService>",
	"<PrinterService>INT17h, Printer services are supported</PrinterService>",
	"<VideoService>INT10h, CGA/Mono Video services are supported</VideoService>",
	"<NECPC_98>NECPC_98 is supported</NECPC_98>",
};

char *BIOSCharacteristicsExt1[] = {
	"<ACPI>ACPI Supported</ACPI>",
	"<USBLegacy>USB Legacy is Supported</USBLegacy>",
	"<AGP>AGP is Supported</AGP>",
	"<I2OBoot>I2O Boot is supported<I2OBoot>",
	"<LS-120Boot>LS-120 boot is supported</LS-120Boot>",
	"<ATAPI>ATAPI ZIP Drive boot is supported</ATAPI>",
	"<BootBy-1394>1394 boot is supported<BootBy-1394>",
	"<SmartBattery>Smart Battery supported</SmartBattery>"
};

char *BIOSCharacteristicsExt2[] = {
	"<BIOSBoot>BIOS Boot Specification supported</BIOSBoot>",
	"<NetworkServiceBoot>Function Key-Initiated Network Service boot supported</NetworkServiceBoot>",
	"<TargetedContentDistribution>Enable Targeted Content Distribution</TargetedContentDistribution>",
};

char *SystemWakeUpType[] = {
	"Reserved",
	"Other",
	"UnKnown",
	"APMTimer",
	"ModemRing",
	"LANRemote",
	"PowerSwitch",
	"PCIPME#",
	"ACPowerRestored"
};

char *FeaturesFlag[] = {   
	"<HostingBoard>Board is a HostingBoard</HostingBoard>",
	"<DaughterBoard>Requires atleast one DaughterBoard</DaughterBoard>",
	"<Removable>Board is Removable</Removable>",
	"<Replaceable>Board is Replaceable</Replaceable>",
	"<HotSwappable>Board is HotSwappable</HotSwappable>"	
};

char *BaseBoardType[] = {
	"UnKnown",
	"Other",
	"ServerBlade",
	"ConnectivitySwitch",
	"SystemManagementModule",
	"ProcessorModule",
	"IOModule",
	"MemoryModule",
	"DaughterBoard",
	"MotherBoard",
	"Processor/MemoryModule",
	"Processor/IOModule",
	"InterconnectBoard"
};

char *SystemChassisType[] = {
	"Other",
	"UnKnown",
	"Desktop",
	"LowProfileDeskTop",
	"PizzaBox",
	"MiniTower",
	"Tower",
	"Portable",
	"LapTop",
	"NoteBook",
	"HandHeld",
	"DockingStation",
	"AllInOne",
	"SubNoteBook",
	"Space-Saving",
	"LunchBox",
	"MainServerChassis",
	"ExpansionChassis",
	"SubChassis",
	"BusExpansionChassis",
	"PheripheralChassis",
	"RaidChassis",
	"RockMountChassis",
	"Sealed-casePC",
	"Multi-SystemChassis"
};

char *ChassisStates[] = {
	"Other",
	"UnKnown",
	"Safe",
	"Warning",
	"Critical",
	"NonRecoverable"
};

char *ChasisSecurityStatus[] = {
	"Other",
	"UnKnown",
	"None",
	"ExternalInterfaceLockedOut",
	"ExternalInterfaceEnabled"
};

char *ProcessorTypeInformation[] = 
{
	"Other",
	"UnKnown",
	"CentralProcessor",
	"MathProcessor",
	"DSPProcessor",
	"VideoProcessor"
};

char *ProcessorFamilyInformation[] = 
{
	"Other",
	"UnKnown",
	"8086",
	"80286",
	"Intel386 Processor",
	"Intel486 Processor",
	"8087",
	"80287",
	"80387",
	"80487",
	"Pentium Processor Family",
	"Pentium Pro Processor",
	"PentiumII Processor",
	"Pentium Processor With MMX Technology",
	"Celeron Processor",
	"PentiumII Xeon Processor",
	"PentiumIII Processor",
	"M1Family",
	"M2Family",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"AMD Duron Processor Family",
	"K5Family",
	"K6Family",
	"K6-2",
	"K6-3",
	"AMD Athlon Processor Family",
	"AMD2900 Family",
	"K6_2+",
	"Power PC Family",
	"Power PC 601",
	"Power PC 603",
	"Power PC 603+",
	"Power PC 604",
	"Power PC 620",
	"Power PC x704",
	"Power PC 750",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Alpha Family",
	"Alpha 21064",
	"Alpha 21066",
	"Alpha 21164",
	"Alpha 21164PC",
	"Alpha 21164a",
	"Alpha 21264",
	"Alpha 21364",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"MIPS Family",
	"MIPSR 4000",
	"MIPSR 4200",
	"MIPSR 4400",
	"MIPSR 4600",
	"MIPSR 10000",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"SPARC Family",
	"SuperSPARC",
	"MicroSPARC II",
	"MicroSPARC IIep",
	"UltraSPARC",
	"UltraSPARC II",
	"UltraSPARC IIi",
	"UltraSPARC III",
	"UltraSPARC IIIi",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"68040 Family",
	"68xxx",
	"68000",
	"68010",
	"68020",
	"68030",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Hobbit Family",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Crusoe TM5000 Family",
	"Crusoe TM3000 Family",
	"Efficeon TM8000 Family",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Weitek",
	"Available for assignment",
	"Itanium Processor",
	"AMD Athlon 64 Processor Family",
	"AMD Opteron Processor Family",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"PA-RISC Family",
	"PA-RISC 8500",
	"PA-RISC 8000",
	"PA-RISC 7300LC",
	"PA-RISC 7200",
	"PA-RISC 7100LC",
	"PA-RISC 7100",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"V30 Family",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Pentium III Xeon Processor",
	"Pentium III Processor with Intel SpeedStep Technology",
	"Pentium 4 Processor",
	"Intel Xeon",
	"AS400 Family",
	"Intel Xeon Processor MP",
	"AMD Athlon XP Processor Family",
	"AMD Athlon MP Processor Family",
	"Intel Itanium 2 Processor",
	"Intel Pentium M Processor",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"IBM390 Family",
	"G4",
	"G5",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"i860",
	"i960",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment",
	"Available for assignment"
};

char *Voltage[] = {
	"5V is Supported",
	"3.3V is supported",
	"2.9V is supported"	
};

char *CPUStatus[] = 
{
	"UnKnown",      
	"Enabled",
	"Disabled by user via BIOS Setup",
	"Disabled by BIOS(POST Error)",
	"Is idle, waiting to be enabled",
	"Reserved",
	"Reserved",
	"Other"
};

char *ProcessorUpgradeInformation[] =
{
	"Other",
	"UnKnown",
	"DaughterBoard",
	"ZIF Socket",
	"Replaceable Piggy Back",
	"None",
	"LIF Socket",
	"Slot1",
	"Slot2",
	"370-pin Socket",
	"Slot A",
	"Slot M",
	"Socket 423",
	"Socket A(Socket 462)",
	"Socket 478",
	"Socket 754",
	"Socket 940"
};

char *ErrorDetectingMethod[] = 
{
	"Other",
	"UnKnown",
	"None",
	"8 Bit Parity",
	"32 Bit ECC",
	"64 Bit ECC",
	"128 Bit ECC",
	"CRC"
};

char *ErrorCorrectingCapability[] = 
{
	"<ErrorCorrectingMethod>Others</ErrorCorrectingMethod>",
	"<ErrorCorrectingMethod>UnKnown</ErrorCorrectingMethod>",
	"<ErrorCorrectingMethod>None</ErrorCorrectingMethod>",
	"<SingleBitMethod>Single Bit ErrorCorrecting is supported</SingleBitMethod>",
	"<DoubleBitMethod>Double Bit ErrorCorrecting</DoubleBitMethod>",
	"<Scrubbling>Error Scrubbing is supported</Scrubbling>"
};

char *InterLeaveSupport[] = 
{
	"Other",
	"UnKnown",
	"One Way Interleave",
	"Two Way Interleave",
	"Four Way Interleave",
	"Eight Way Interleave",
	"Sixteen Way Interleave"
};

char *Memory_Speed[] = {
	"<Speed0>Other</Speed0>",
	"<Speed1>UnKnown</Speed1>",
	"<Speed2>70ns</Speed2>",
	"<Speed3>60ns</Speed3>",
	"<Speed4>50ns</Speed4>"
};

char *Memory_Types[] =
{
	"<Type0>Other</Type0>",
	"<Type1>UnKnown</Type1>",
	"<Type2>Standard</Type2>",
	"<Type3>Fast Page Mode</Type3>",
	"<Type4>EDO</Type4>",
	"<Type5>Parity</Type5>",
	"<Type6>ECC</Type6>",
	"<Type7>SIMM</Type7>",
	"<Type8>DIMM</Type8>",
	"<Type9>Burst EDO</Type9>",
	"<Type10>SDRAM</Type10>"
};

char *Memory_Voltage[] =
{
	"<Voltage0>5V</Voltage0>",
	"<Voltage1>3.3V</Voltage1>",
	"<Voltage2>2.9V</Voltage2>"	
};

char *ErrorStatus[] = {
	"<Status0>Uncorrectable errors received for the module</Status0>",
	"<Status1>Correctable errors received for the module</Status1>",
	"<Status2>Obtain error status from event log</Status2>"
};

char *Cache_Location[] = {
	"Internal",
	"External",
	"Reserved",
	"UnKnown"
};

char *Cache_Opr_Mode[] = {
	"Write Through",
	"Write Back",
	"Varies with memory address",
	"Unknown"
};

char *Cache_SRAMType[] = 
{
	"<Type0>Other</Type0>",
	"<Type1>UnKnown</Type1>",
	"<Type2>Non-Burst</Type2>",
	"<Type3>Burst</Type3>",
	"<Type4>Pipeline Burst</Type4>",
	"<Type5>Synchronous</Type5>",
	"<Type6>Asynchronous</Type6>"
};

char *Cache_ErrorCorrectionType[] = 
{
	"Other",
	"UnKnown",
	"None",
	"Parity",
	"Single-bit ECC",
	"Multi-Bit ECC"
};

char *Cache_Type[] =
{
	"Other",
	"UnKnown",
	"Instruction",
	"Data",
	"Unified"
};

char *Cache_Associativity[] = 
{
	"Other",
	"UnKnown",
	"Direct Mapped",
	"2-Way Set-Associative",
	"4-Way Set-Associative",
	"Fully Associative",
	"8-Way Set-Associative",
	"16-Way Set-Associative"
};

char *Port_ConnectorTypes[] =
{
	"None",
	"Centronics",
	"Mini Centronics",
	"Proprietary",
	"DB-25 pin male",
	"DB-25 pin female",
	"DB-15 pin male",
	"DB-15 pin female",
	"DB-9 pin male",
	"DB-9 pin female",
	"RJ-11",
	"RJ-45",
	"50 pin MiniSCSI",
	"Mini-DIN",
	"Micro-DIN",
	"PS/2",
	"Infrared",
	"HP-HIL",
	"Access Bus(USB)",
	"SSA SCSI",
	"Circular DIN-8 Male",
	"Circular DIN-8 Female",
	"OnBoard IDE",
	"OnBoard Floppy",
	"9 Pin Dual Inline(Pin 10 cut)",
	"25 Pin Dual Inline(Pin 26 cut)",
	"50 Pin Dual Inline",
	"68 Pin Dual Inline",
	"OnBoard Sound input from CD-ROM",
	"Mini-Centronics Type-14",
	"Mini-Centronics Type-26",
	"Mini-Jack(Headphones)",
	"BNC",
	"1394",
	"PC-98",
	"PC-98Hireso",
	"PC-H98",
	"PC-98Note",
	"PC-98Full",
	"Other"
};

char *Port_Types[] =
{
	"None",
	"Parallel Port XT/AT Compatible",
	"Parallel Port PS/2",
	"Parallel Port ECP",
	"Parallel Port EPP",
	"Parallel Port ECP/EPP",
	"Serial Port XT/AT Compatible",
	"Serial Port 16450 Compatible",
	"Serial Port 16550 Compatible",
	"Serial Port 16550A Compatible",
	"SCSI Port",
	"MIDI Port",
	"JoyStick Port",
	"KeyBoard Port",
	"Mouse Port",
	"SSA SCSI",
	"USB",
	"FireWire(IEEE 1394)",
	"PCMCIA Type II",
	"PCMCIA Type II",
	"PCMCIA Type III",
	"CardBus",
	"Access Bus Port",
	"SCSI II",
	"SCSI Wide",
	"PC-98",
	"PC-98-Hierso"
	"PC-H98",
	"Video Port",
	"Audio Port",
	"Modem Port",
	"Network Port",
	"8251 Compatible",
	"8251 FIFO Compatible",
	"Other"
};

char *Slot_Types[] =
{
	"Other",
	"UnKnown",
	"ISA",
	"MCA",
	"EISA",
	"PCI",
	"PC Card(PCMCIA)",
	"VL-VESA",
	"Propietary",
	"Processor Card Slot",
	"Processor Memory Card Slot",
	"I/O Riser Card Slot",
	"NuBus",
	"PCI-66MHz Capable",
	"AGP",
	"AGP 2X",
	"AGP 4X",
	"PCI-X",
	"AGP 8X",
	"PC-98/C20",
	"PC-98/C24",
	"PC-98/E",
	"PC-98/LocalBus",
	"PC-98/Card",
	"PCI Express"
};

char *Slot_DataBusWidth[] =
{
	"Other",
	"UnKnown",
	"8 Bit",
	"16 Bit",
	"32 Bit",
	"64 Bit",
	"128 Bit",
	"1x 0r x1",
	"2x or x2",
	"4x or x4",
	"8x or x8",
	"12x or x12",
	"16x or x16",
	"32x or x32"
	
};

char *Slot_CurrentUsage[] =
{
	"Other",
	"UnKnown",
	"Available",
	"In Use"
};

char *Slot_Length[] =
{
	"Other",
	"UnKnown",
	"ShortLength",
	"LongLength"
};

char *Slot_Characteristic1[] = {
	"<Characteristics>Unknown</Characteristics>",
	"<Voltage>Provides 5.0 Volts</Voltage>",
	"<Voltage>Provides 3.3 Volts</Voltage>",
	"<SlotOpening>Slot opening is shared with another slot</SlotOpening>",
	"<PCCard16>PC Card slot supports PC Card-16</PCCard16>"
	"<CardBus>PC Card slot supports CardBus</CardBus>",
	"<ZoomVideo>PC Card slot supports Zoom Video</ZoomVideo>",
	"<ModemRing>PC Card slot supports Modem Ring Resume</ModemRing>"
};

char *Slot_Characteristic2[] = {
	"<PME>PCI slot supports Power Management Enable(PME#) signal</PME>",
	"<HotPluggable>Slot supports hot plug devices</HotPluggable>",
	"<SMBus>PCI slot supports SMBus signal</SMBus>",
};

char *OnBoardDevice_Type[] =
{
	"Other",
	"UnKnown",
	"Video",
	"SCSIController",
	"Ethernet",
	"TokenRing",
	"Sound"
};

char *Physic_Mem_Location[] =
{
	"Other",
	"UnKnown",
	"System board or motherboard",
	"ISA add-on card",
	"EISA add-on card",
	"PCI add-on card",
	"MCA add-on card",
	"PCMCIA add-on card",
	"Proprietary add on card",
	"NuBus",
	"PC-98/C20 add-on card",
	"PC-98/C24 add-on card",
	"PC-98/E add-on card",
	"PC-98/LocalBus add-on card"
};

char *Physic_Mem_Use[] =
{
	"Other",
	"UnKnown",
	"System memory",
	"Video memory",
	"Flash memory",
	"Non-Volatile RAM",
	"Cache memory"
};

char *Physic_Mem_ErrorCorrection[] =
{
	"Other",
	"UnKnown",
	"None",
	"Parity",
	"Single-bit ECC",
	"Multi-bit ECC",
	"CRC"
};

char *FormFactor[] = 
{
	"Other",
	"UnKnown",
	"SIMM",
	"SIP",
	"Chip",
	"DIP",
	"ZIP",
	"Proprietary Card",
	"DIMM",
	"TSOP",
	"Row Of Chips",
	"RIMM",
	"SODIMM",
	"SRIMM"
};

char *MemoryDevice_Type[] = 
{
	"Other",
	"UnKnown",
	"DRAM",
	"EDRAM",
	"VRAM",
	"SRAM",
	"RAM",
	"ROM",
	"FLASH",
	"EEPROM",
	"FEPROM",
	"EPROM",
	"CDRAM",
	"3DRAM",
	"SDRAM",
	"SGRAM",
	"RDRAM",
	"DDR",
	"DDR2"
};

char *TypeDetail[] ={
	"<TypeDetail>Reserved</TypeDetail>",
	"<TypeDetail>Other</TypeDetail>",
	"<TypeDetail>UnKnown</TypeDetail>",
	"<Type0>FastPaged</Type0>",
	"<Type1>Static column</Type1>",
	"<Type2>Pseudo-Static</Type2>",
	"<Type3>RAMBUS</Type3>",
	"<Type4>Synchronous</Type4>",
	"<Type5>CMOS</Type5>",
	"<Type6>EDO</Type6>",
	"<Type7>Window DRAM</Type7>",
	"<Type8>Cache DRAM<Type8>",
	"<Type9>Non-Volatile<Type9>"
};

char *Error_Type[] = 
{
	"Other",
	"UnKnown",
	"Ok",
	"Bad read",
	"Parity error",
	"Single-bit error",
	"Double-bit error",
	"Multi-bit error",
	"Nibble error",
	"Checksum error",
	"CRC error",
	"Corrected single-bit error",
	"Corrected error",
	"UnCorrected error"
};

char *Error_Granularity[] =
{
	"Other",
	"UnKnown",
	"Device level",
	"Memory partition level"
};

char *Error_Operation[] =
{
	"Other",
	"UnKnown",
	"Read",
	"Write",
	"Partial write"
};

char *Log_AccessMethod[] = {
	"Indexed I/O: 1 8-bit index port, 1 8-bit data port",
	"Indexed I/O: 2 8-bit index port, 1 8-bit data port",
	"Indexed I/O: 1 16-bit index port, 1 8-bit data port",
	"Memory mapped physical 32-bit address",
	"General Purpose NonVolatile Handle",
};

char *EventLogType[] = 
{
	"Reserved",
	"Single-bit ECC memory error",
	"Multi-bit memory ECC error",
	"Parity memory error",
	"Bus time-out",
	"I/O Channel Check",
	"Software NMI",
	"POST Memory Resize",
	"POST Error",
	"PCI Parity Error",
	"PCI System Error",
	"CPU Failure",
	"EISA FailSafe Timer time-out",
	"Correctable memory log disabled",
	"Logging disabled for a specific Event Type",
	"Reserved",
	"System Limit Exceeded",
	"Asynchronous HW Timer Expired And Isuued a system reset",
	"System configuration information",
	"Hard-disk information",
	"System reconfigured",
	"UnCorrectable CPU-complex error",
	"Log Area Reset/Cleared",
	"System boot",
	"EndOfRecord"
};

char *VariableDataFormat[] = {
	"None",
	"Handle",
	"Multiple-Event",
	"Multiple-Event Handle",
	"POST Results Bitmap",
	"System management type",
	"Multiple-Event system management type",
	"Unused",
	"OEM assigned"
};

char *PointingDevice_Type[] =
{
	"Other",
	"UnKnown",
	"Mouse",
	"Track Ball",
	"Track Point",
	"Glide Point",
	"Touch Pad",
	"Touch Screen",
	"Optical Sensor"
};

char *PointingDevice_Interface[] =
{
	"Other",
	"UnKnown",
	"Serial",
	"PS/2",
	"Infrared",
	"HP-HIL",
	"Bus mouse",
	"ADB (Apple DeskTop Bus)",
	"Bus mouse DB9",
	"Bus mouse micro-DIN",
	"USB"
};

char *SystemReset_BootOption[] = {
	"Reserved",
	"Operating System",
	"System utilities",
	"Do not reboot"
};

char *HWSecurityStatus[] = {
	"Disabled",
	"Enabled",
	"Not Implemented",
	"Unknown"
};

char *Probe_Location[] =
{
	"Other",
	"UnKnown",
	"Processor",
	"Disk",
	"Pheripheral Bay",
	"System Managemnt Module",
	"MotherBoard",
	"Memory Module",
	"Processor Module",
	"Power Unit",
	"Add-in Card"
};

char *Device_Status[] =
{
	"Other",
	"UnKnown",
	"Ok",
	"Non-Critical",
	"Critical",
	"Non-Recoverable"
};

char *CoolingDevice_Type[] =
{
	"Other",
	"UnKnown",
	"Fan",
	"Centrifugal Blower",
	"Chip Fan",
	"Cabinet Fan",
	"Power Supply Fan",
	"Heat Pipe",
	"Intergrated Refrigeration",
	"Active Cooling",
	"Passive Cooling"
};

char *TempretureProbe_Location[] =
{
	"Other",
	"UnKnown",
	"Processor",
	"Disk",
	"Pheripheral Bay",
	"System Management Module",
	"MotherBoard",
	"Memory Module",
	"Processor Module",
	"Power Unit",
	"Add-In Card",
	"Front Panel Board",
	"Back Panel Board",
	"Power System Board",
	"Drive Back Plane"
};

char *SystemBootStatus[] ={
	"No erros detected",
	"No bootable media",
	"Normal Operating system failed to load",
	"Firmware detected hardware failure",
	"OS detected hardware failure",
	"User requested boot",
	"System security violation",
	"Previously requested image",
	"A system watchdog timer expired, causing the system to reboot"	
};

char *ManagementDevice_Type[] =
{
	"Other",
	"UnKnown",
	"NationalSemiconductor LM75",
	"NationalSemiconductor LM78",
	"NationalSemiconductor LM79",
	"NationalSemiconductor LM80",
	"NationalSemiconductor LM81",
	"AnalogDevices ADM9240",
	"DallasSemiconductor DS1780",
	"Maxim 1617",
	"Genesys GL518SM",
	"WinBond W83781D",
	"HolTek HT82H791"
};

char *ManagementDevice_AddressType[] =
{
	"Other",
	"UnKnown",
	"I/O Port",
	"Memory",
	"SM Bus"
};

char *MemoryChannel_Type[] =
{
	"Other",
	"UnKnown",
	"RAMBus",
	"SyncLink"
};

char *BMCInterfaceType[] =
{
	"UnKnown",
	"KCS:KeyBoard Controller Style",
	"SMIC:Server Management Interface Chip",
	"SMIC:Block Transfer"
};

char *DMTF_PowerSupplyType[] =
{
	"Other",
	"UnKnown",
	"Linear",
	"Switching",
	"Battery",
	"UPS",
	"Converter",
	"Regulator"
};

char *PowerSupply_Status[] =
{
	"Other",
	"UnKnown",
	"Ok",
	"NonCritical",
	"Critical"
};

char *DMTFIPVoltageSwitching[] =
{
	"Other",
	"UnKnown",
	"Manual",
	"AutoSwitch",
	"WideRange",
	"NotApplicable"
};

struct _BIOS_INFO
{
	char	VendorName[256];
	char	Version[256];
	unsigned int 	StartingAddress;
	char	ReleaseDate[25];
	unsigned int	ROMSize;
	unsigned long	SystemBIOSMajorRelease;
	unsigned long 	SystemBIOSMinorRelease;
	unsigned long	EmbeddedControllerFirmwareMajorRelease;
	unsigned long	EmbeddedControllerFirmwareMinorRelease;
	//struct	_BIOS_CHARACTERISTICS Characteristics;
	char	Characteristics[65535];
	char	CharacteristicsExt1[32767];	
	char	CharacteristicsExt2[32767];
}Bios_Info;

struct _SYSTEM_INFORMATION
{
	char	Manufacturer[256];
	char	ProductName[256];
	char	Version[256];
	char	SerialNo[256];
	char	UUID[256];
	char	WakeUpType[256];
	char	SKUNo[256];
	char	Family[256];	
}System_Info;

struct _BASEBOARD_INFORMATION
{
	char	Manufacturer[256];
	char	ProductName[256];
	char	Version[256];
	char	SerialNo[256];
	char	FeaturesFlag[256];
	char	BoardType[256];
}BaseBoard_Info;

struct	ContainedElementType
{
	unsigned int	TypeSelect;
	char	BaseBoardType[256];
	char	SMBIOSStructureType[256];
};

struct	ContainedElements
{
	//struct ContainedElementType  ;
	int		ContainedElementMinimum;
	int		ContainedElementMaximum;
};

struct _SYSTEM_CHASSIS_TYPE
{
	char	ChassisLock[25];
	char	ChassisType[256];
};

struct _SYSTEMENCLOSURE
{
	char		Manufacturer[256];
	char		Version[256];
	char		SerialNo[256];
	char		BootUpState[25];
	char		PowerSupplyState[25];
	char		ThermalState[25];
	char		SecurityStatus[25];
	unsigned int	NoOfPowerCords;
	unsigned int	ContainedElementCount;
	unsigned int	ContainedElementRecordLength;
	struct	_SYSTEM_CHASSIS_TYPE SystemChassisType;
	//struct	ContainedElements;
}SystemEnclosure;

struct _PROCESSOR_INFORMATION
{
	char			SocketDesignation[256];
	char			ProcessorType[256];
	char			ProcessorFamily[256];
	char			Manufacturer[256];
	char			ProcessorID[16];
	char			ProcessorVersion[256];
	char			Voltage[256];
	unsigned int 		ExternalClock;
	unsigned int 		MaxSpeed;
	unsigned int 		CurrentSpeed;
	char			Status[256];
	char			ProcessorUpgrade[256];
	char			L1CacheHandle[25];
	char			L2CacheHandle[25];
	char			L3CacheHandle[25];
	char			SerialNo[25];      
	char			AssertTag[25];      
	char			PartNo[25];      
}Processor_Info;

struct _MEMORY_CONTROLLER_INFO
{
	char			ErrorDetectingMethod[25];
	char			ErrorCorrectingCapability[50];
	char			SupportedInterLeave[256];
	char			CurrentInterLeave[256];
	unsigned int		MaxMemoryModuleSize;
	char			SupportedSpeed[256];
	char			SupportedMemoryType[256];
	char			MemoryModuleVoltage[25];
	int			NoOfAssociatedMemorySlots;
	unsigned long		MemoryModuleConfigHandle[255];				
	char			EnabledErrorCorrectingCapabilities[256];
}MemoryController_Info;
    
struct	Memory_Installed
{
	char	InstalledSize[50];
	char	Installed_NoOfBanks[25];
};
	      
struct Memory_Enabled
{
	char	EnabledMemory_Size[50];
	char	EnabledMemory_NoOfBanks[25];
};
	      
struct _MEMORY_MODULE_INFO
{
	char			SocketDesignation[256];
	char			BankConnections[256];
	unsigned int		CurrentSpeed;
	char			CurrentMemoryType[256];
	struct			Memory_Installed InstalledMem;
	struct			Memory_Enabled EnabledMem;	
	char			Memory_ErrorStatus[256];
}MemoryModule_Info;
   
struct CacheConfiguration
{
	char	CacheLevel[25];
	char	CacheSocketed[25];
	char	Location[25];
	char	Enabled[25];
	char	OperationMode[25];	
};
	      
struct MaxCacheSize
{
	char			Granularity[25];
	unsigned long	Size;
};

struct InstalledCache
{
	char	Inst_Granularity[25];
	unsigned long	Inst_Size;
};	 
   
struct _CACHE_INFORMATION
{
    char			SocketDesignation[256];
	char			SupportedSRAMType[256];
	char			CurrentSRAMType[256];
	unsigned long	CacheSpeed;
	char			ErrorCorrectionType[256];
	char			SystemCacheType[256];
	char			Associativity[256];      
	struct			CacheConfiguration CacheConfig;
	struct			MaxCacheSize MaxSize;
	struct			InstalledCache Inst_Cache;
}Cache_Info;

struct _PORT_CONNECTOR_INFORMATION
{
 	char	InternalReferenceDesignator[256];
	char	InternalConnectorType[256];
	char	ExternalReferenceDesignator[256];
	char	ExternalConnectorType[256];
	char	PortType[256];
}PortConnector_Info;

struct _SYSTEM_SLOTS
{
	char			SlotDesignation[256];
	char			SlotType[256];
	char			SlotDataBusWidth[256];
	char			CurrentUsage[256];
	char			SlotLength[256];
	unsigned long	SlotID;
	char			SlotCharacteristics1[256];
	char			SlotCharacteristics2[256];
}SystemSlots;     

struct OnBoardDeviceType
{	    
	char	Status[25];
	char	DeviceType[25];
};

struct _ONBOARD_DEVICE_INFO
{
	struct	OnBoardDeviceType Device;
	char	DescriptionString[256];      
}OnBoardDevice_Info;

struct	_OEM_STRING
{
    unsigned long	Count;
}OEMString;

struct	_SYSTEM_CONFIG_OPTIONS
{
	unsigned long	Count;
}SystemConfig_Options;

struct SupportedLanguage {
	int		NoOfLanguage;
	char	*Name[10];
};

struct	_BIOS_LANG_INFO
{
 	char			Flags[100];
	char			CurrentLanguage[256];
	struct		SupportedLanguage Language;
}BIOS_Lang_Info;

struct ItemDetails{
	char			Type[25];
	unsigned long	Handle;
};

struct	_GROUP_ASSOCIATION
{
	char	GroupName[256];	
	struct	ItemDetails Item[42];
	int		ItemCount;
}GroupAssociation;

struct	SupportedEventLog
{
	char	LogType[50];
	char	VariableDataFormat[50];	
};

struct	_SYSTEM_EVENT_LOG
{
    unsigned long		LogAreaLength;
	unsigned long		LogHeaderStartOffset;
	unsigned long		LogDataStartOffset;
	char				AccessMethod[50];
	char				LogStatus[100];
	unsigned long long	LogChangeToken;
	unsigned long long	AccessMethodAddress;
	char				LogHeaderFormat[50];
	int					NoOfSupportedLogType;
	unsigned long		LogTypeLength;
	struct				SupportedEventLog EventLog[MAX_LOG];
}SystemEventLog;

struct	_PHYSICAL_MEMORY_ARRAY
{
    char			Location[256];
	char			Use[256];
	char			ErrorCorrection[256];
	unsigned long	MaximumCapacity;
	char			ErrorInformationHandle[50];
	unsigned long	NoOfDevices;
}PhysicalMemoryArray;

struct	MemorySize
{
	char	Granularity[25];
	char	Size[25];
};	      

struct	_MEMORY_DEVICE
{
 	unsigned long	PhysicalMemoryArrayHandle;
	unsigned long	MemoryErrorInformationHandle;
	unsigned long	TotalWidth;
	unsigned long	DataWidth;
	struct			MemorySize MemSize;
	char			FormFactor[25];
	unsigned long	DeviceSet;
	char			DeviceLocator[256];
	char			BankLocator[256];
	char			MemoryType[256];
	char			TypeDetail[50];	
	char			Speed[25];
	char			Manufacturer[256];
	char			SerialNo[256];
	char			AssetTag[256];
	char			PartNo[256];
}MemoryDevice;    

struct	_MEMORY_ERR_INFO_32BIT
{
 	char				ErrorType[35];
	char				ErrorGranularity[35];
	char				ErrorOperation[20];
	unsigned long long		VendorSyndrome;
	unsigned long long	MemoryArrayErrorAddress;
	unsigned long long	DeviceErrorAddress;
	unsigned long long	ErrorResolution;      
}Memory_Err_Info_32Bit;

struct	_MEMORY_ARRAY_MAPPED_ADDR
{
    unsigned long long	StartingAddress;
	unsigned long long	EndingAddress;
	unsigned long		MemoryArrayHandle;
	unsigned long		PartitionWidth;
}MemoryArrayMappedAddr;

struct	_MEMORY_DEVICE_MAPPED_ADDR
{
 	unsigned long long	StartingAddress;
	unsigned long long	EndingAddress;
	unsigned long		MemoryDeviceHandle;
	unsigned long		MemoryArrayHandle;
	int					PartitionRowPosition;
	int					InterLeavePosition;
	int					InterLeavedDataDepth;
}MemoryDeviceMappedAddr;

struct	_BUILD_IN_POINTING_DEVICE
{
    char	Type[25];
	char	Interface[50];
	int		NoOfButtons;
}BuildInPointingDevice;

struct	ResetCapabilities
{
	char	Status[25];
    char	BootOption[25];
	char	BootOptionLimit[25];
	char	HasWatchDogTimer[25];	
};

struct	_SYSTEM_RESET
{
	unsigned long	ResetCount;
	unsigned long	ResetLimit;
	unsigned long	TimeInterval;
	unsigned long	TimeOut;
	struct			ResetCapabilities Capabilities;	    
}SystemReset;

struct	_HW_SECURITY
{
	char	PowerOnPasswordStatus[25];
	char	KeyBoardPasswordStatus[25];
	char	AdministratorPasswordStatus[25];
	char	FrontPanelResetStatus[25];
}HWSecurity;

struct	_SYSTEM_POWER_CONTROL
{
    int		NextScheduledPowerOnMonth;
	int		NextScheduledPowerOnDayOfMonth;
	int		NextScheduledPowerOnHour;
	int		NextScheduledPowerOnMinute;
	int		NextScheduledPowerOnSecond;
}SystemPowerControl;

struct	VoltageProbe_LocationAndStatus
{
	char	Location[50];
	char	Status[50];
};

struct	_VOLTAGE_PROBE
{
	char			Description[256];
    struct			VoltageProbe_LocationAndStatus VProbe;
	unsigned long	MaximumValue;
	unsigned long	MinimumValue;
	unsigned long	Resolution;
	unsigned long	Tolerance;
	unsigned long	Accuracy;
	unsigned long	NominalValue;
}VoltageProbe;

struct	CoolingDeviceDetails
{
	char	DeviceType[50];
	char	Status[50];
};

struct	_COOLING_DEVICE
{
	unsigned long	TempratureProbeHandle;
	struct			CoolingDeviceDetails DeviceDetail;
	int				CoolingUnitGroup;
	unsigned long	NominalSpeed;
}CoolingDevice;

struct	TempProbe_LocationAndStatus
{
	char	Location[50];
	char	Status[50];      
};

struct	_TEMPRATURE_PROBE
{
    char			Description[256];
    struct			TempProbe_LocationAndStatus TempratureProbeDetails;
	unsigned long	MaximumValue;
	unsigned long	MinimumValue;
	unsigned long	Resolution;
	unsigned long	Tolerance;
	unsigned long	Accuracy;
	unsigned long	NominalValue;
}TempratureProbe;

struct	CurrentProbe_LocationAndStatus
{	    
	char	Location[50];
	char	Status[50];
};

struct	_ELECTRICAL_CURRENT_PROBE
{
    char			Description[256];
    struct			CurrentProbe_LocationAndStatus CurrentProbeDetails;
	unsigned long	MaximumValue;
	unsigned long	MinimumValue;
	unsigned long	Resolution;
	unsigned long	Tolerance;
	unsigned long	Accuracy;
	unsigned long	NominalValue;
}ElectricalCurrentProbe;

struct	Connections
{
	char	OutBoundConnectionEnabled[25];
	char	InBoundConnectionEnabled[25];
};

struct	_OUT_OF_BAND_REMOTE_ACCESS
{
	char	ManufacturerName[256];
	struct	Connections Con;
}OutOfBandRemoteAccess;

struct	_SYSTEM_BOOT_INFO
{
	char	BootStatus[100];
	char	AdditionalData[256];

}SystemBoot_Info;

struct	_MEMORY_ERR_INFO_64BIT
{
	char	ErrorType[25];
    char	ErrorGranularity[25];
	char	ErrorOperation[25];
    unsigned long long	VendorSyndrome;
	unsigned long long	MemoryArrayErrorAddress;
	unsigned long long	DeviceErrorAddress;
	unsigned long long	ErrorResolution;
}Memory_Err_Info_64Bit;

struct	_MANAGEMENT_DEVICE
{
	char				Description[256];
    char				Type[50];
	unsigned long long	Address;
	char				AddressType[25];
}ManagementDevice;

struct	_MANAGEMENT_DEVICE_COMPONENT
{
	char			Description[256];
	unsigned long	ManagementDeviceHandle;
	unsigned long	ComponentHandle;
	unsigned long	ThresholdHandle;
}ManagementDeviceComponent;

struct	_MNGMT_DEV_THRESHOLDDATA
{
	unsigned long	LowerThresholdNonCritical;
	unsigned long	UpperThresholdNonCritical;
	unsigned long	LowerThresholdCritical;
	unsigned long	UpperThresholdCritical;
	unsigned long	LowerThresholdNonRecoverable;
	unsigned long	UpperThresholdNonRecoverable;	
}Mngmt_Dev_ThresholdData;

struct _MEMORY_CHANNEL	
{
	char			ChannelType[25];
	unsigned long	MaxChannelLoad;
	unsigned long	MemoryDeviceCount;
	unsigned long	Memory1DeviceLoad;
	unsigned long	MemoryDevice1Handle;
	unsigned long	MemoryDeviceNLoad;
	unsigned long	MemoryDeviceNHandle;
}MemoryChannel;

struct	BaseAddress{
	unsigned long long	Address;
	char				MappedMemory[25];
};

struct	_IPMI_DEVICE_INFO
{
	char			InterfaceType[256];
	char			IPMISpecRevision[25];
	unsigned long	I2CSlaveAddress;
	unsigned long	NVStorageAddressDevice;
	struct			BaseAddress Addr;
}IPMIDevice_Info;

struct	PowerSupplyCharacteristics
{
	char	DMTFPowerSupplyType[50];
	char	Status[25];
	char	InputVoltageSwitching[50];
	char	PowerSupplyUnplugged[25];
	char	PowerSupplyPresent[25];
	char	HotReplacable[25];
};	

struct	_SYSTEM_POWER_SUPPLY
{
	unsigned long	PowerUnitGroup;
	char			Location[256];
	char			DeviceName[256];
	char			Manufacturer[256];
	char			SerialNo[256];
	char			AssetTagNo[256];
	char			ModelPartNo[256];
	char			RevisionLevel[256];
	char			MaxPowerCapacity[25];
	struct			PowerSupplyCharacteristics Characteristics;	    
	unsigned long	InputVotageProbeHandle;
	unsigned long	CoolingDeviceHandle;
	unsigned long	InputCurrentProbeHandle;
}SystemPowerSupply;

struct  _BOOT_CONFIG_SETTING_INFO
{
        char            InstanceID[256];
        char            ElementName[256];
}BootConfigSetting_Info;

struct _COMPUTER_SYSTEM_INFO{
        unsigned short	Dedicated[25];
        unsigned int 	Dedicated_Count;
        char	 	Name[256];
        char	 	CreationClassName[256];
        char	 	* OtherIdentifyingInfo[25];
        unsigned int	OtherIdentifyingInfo_Count;
        char 		* IdentifyingDescriptions[25];
        unsigned int	IdentifyingDescriptions_Count;
        unsigned int 	EnabledState;
        unsigned int	RequestedState;
        unsigned short	OperationalStatus[25];
        unsigned int	OperationalStatus_Count;
        unsigned int	HealthState;
        char		ElementName[256];

}ComputerSystem_Info;

struct _BOOT_SERVICE_INFO{
        char Name[256];
        char CreationClassName[256];
        char SystemCreationClassName[256];
        char SystemName[256];
        char ElementName[256];
}BootService_Info;

struct _BOOT_SERVICE_CAPABILITIES_INFO
{
        char		InstanceID[256];
        char		ElementName[256];
        char		ElementNameEditSupported[256];
        unsigned short	BootConfigCapabilities_Count;
        char 		BootConfigCapabilities[256];
}BootServiceCapabilities_Info;

struct _BOOT_SOURCE_SETTING_INFO
{
        char	InstanceID[256];
        char	ElementName[256];
        char	BootString[256];
        char	BIOSBootString[256];
        char	StructuredBootString[256];
}BootSourceSetting_Info;

struct _REGISTERED_PROFILE_INFO{
        char		InstanceID[256];
        unsigned short 	RegisteredOrganization;
        char 		OtherRegisteredOrganization[256];
        char		RegisteredName[256];
        char		RegisteredVersion[256];

        unsigned short	AdvertiseTypes[25];
        unsigned short	AdvertiseTypes_Count;
        char		*AdvertiseTypeDescriptions[25];
        unsigned short	AdvertiseTypeDescriptions_Count;
        char		Caption[256];
        char		Description[256];
        char 		ElementName[256];
}RegisteredProfile_Info;

struct _REDUNDANCYSET_INFO{
        char		InstanceID[256];
        unsigned short	RedundancyStatus;
        unsigned short	TypeOfSet[25];
        unsigned short 	TypeOfSet_Count;
        unsigned long	MinNumberNeeded;
        char 		ElementName[256];
}RedundancySet_Info;

struct _TIMESERVICE_INFO{
        char	SystemCreationClassName[256];
        char 	CreationClassName[256];
        char	SystemName[256];
        char	Name[256];
        char	ElementName[256];
}TimeService_Info;

struct _PROCESSOR_DUMMYINFO{
        char		DeviceID[256];
	char		SystemCreationClassName[256];
        char		SystemName[256];
        char		CreationClassName[256];
	unsigned short	Family;
	unsigned long 	CurrentClockSpeed;
	unsigned long	MaxClockSpeed;
	unsigned short	CPUStatus;
        unsigned short	LoadPercentage;
        unsigned short	HealthState;
        unsigned short	OperationalStatus[25];
        unsigned short	OperationalStatus_Count;
        unsigned short	EnabledState;
        unsigned short	RequestedState;
        char		ElementName[256];
        char		OtherFamilyDescription[256];
}Processor_DummyInfo;

struct _PROCESSORCORE_INFO{
        char		InstanceID[256];
        unsigned short	CoreEnabledState;
        unsigned short	LoadPercentage;
        unsigned short	HealthState;
        unsigned short	OperationalStatus[25];
        unsigned short	OperationalStatus_Count;
        unsigned short	EnabledState;
        unsigned short	RequestedState;
        char		ElementName[256];

}ProcessorCore_Info;

struct _MEMORY_DUMMYINFO{
        char		DeviceID[256];
        char		SystemCreationClassName[256];
        char		SystemName[256];
        char		CreationClassName[256];
        long		Blocksize;
        long		NumberOfBlocks;
        unsigned short	HealthState;
        unsigned short	OperationalStatus[25];
        unsigned short	OperationalStatus_Count;
        unsigned short	EnabledState;
        unsigned short	RequestedState;
        char		ElementName[256];
}Memory_DummyInfo;

struct _HARDWARETHREAD_INFO{
        char		InstanceID[256];
        unsigned short	LoadPercentage;
        unsigned short	HealthState;
        unsigned short	OperationalStatus[25];
        unsigned short	OperationalStatus_Count;
        unsigned short	EnabledState;
        unsigned short	RequestedState;
        char		ElementName[256];

}HardwareThread_Info;

struct _ENABLED_LOGICAL_ELEMENT_CAPABILITIES_INFO {
        char	 	InstanceID[256];
        char		ElementNameEditSupported[256];
        unsigned short 	MaxElementNameLen;
        unsigned short  RequestedStatesSupported[25];
        unsigned short  RequestedStatesSupported_Count;

}EnabledLogicalElementCapabilities_Info;

struct _SOFTWARE_IDENTITY_INFO{
        char		InstanceID[256];
        unsigned short	VersionString;
        unsigned short	MajorVersion;
        unsigned short	MinorVersion;
        unsigned short	RevisionNumber;
        unsigned short	BuildNumber;
}SoftwareIdentity_Info;

struct _SOFTWARE_IDENTITY_RESOURCE_INFO{
        char		Name[256];
        char		SystemCreationClassName[256];
        char		SystemName[256];
        char		CreationClassName[256];
        unsigned short	InfoFormat;
        unsigned short	ResourceType;
        char		AccessInfo[256];
}SoftwareIdentityResource_Info;

struct _SYSTEM_SPECIFIC_COLLECTION_INFO{
        char		InstanceID[256];
        char		ElementName[256];

}SystemSpecificCollection_Info;

struct _PROCESSOR_CAPABILITIES_INFO{
        char            InstanceID[256];
	unsigned short 	NumberOfProcessorCores;
        unsigned short	NumberOfHardwareThreads;
        unsigned short	MaxElementNameLen;
	int 	       	ElementNameEditSupported;
        unsigned short	RequestedStatesSupported[25];
        unsigned short	RequestedStatesSupported_Count;
}ProcessorCapabilities_Info;


