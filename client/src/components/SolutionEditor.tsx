import React, { useState } from 'react';
import { MermaidPreview } from './MermaidPreview';
import { SubmissionPayload } from '../services/api';
import {
  FileText,
  Boxes,
  Network,
  GitFork,
  Scale,
  Sparkles,
  Send,
  Wand2,
  AlertCircle,
} from 'lucide-react';

interface SolutionEditorProps {
  problemTitle?: string;
  problemSlug: string;
  initialValues?: Partial<SubmissionPayload>;
  onSubmit: (values: SubmissionPayload) => void;
  isSubmitting: boolean;
}

export const SolutionEditor: React.FC<SolutionEditorProps> = ({
  problemSlug,
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = useState<string>('classes');

  const [assumptions, setAssumptions] = useState<string>(
    initialValues?.assumptions ||
      '1. The facility operates 24/7 with automated gates and digital spot sensors.\n2. Concurrency is handled at the spot allocation level with atomic mutex locks.\n3. Standard payment methods supported (Cash, Card, Digital Wallet).'
  );

  const [classes, setClasses] = useState<string>(
    initialValues?.classes ||
      `// Core Domain Entities & Interfaces
interface SpotAllocationStrategy {
  allocateSpot(vehicle: Vehicle): ParkingSpot | null;
}

interface PricingStrategy {
  calculateFee(durationMinutes: number, vehicleType: VehicleType): number;
}

class ParkingLot {
  private id: string;
  private levels: ParkingLevel[];
  private allocationStrategy: SpotAllocationStrategy;
  private pricingStrategy: PricingStrategy;
  
  public entry(vehicle: Vehicle): ParkingTicket { /* ... */ }
  public exit(ticket: ParkingTicket): PaymentReceipt { /* ... */ }
}

class ParkingSpot {
  private spotId: string;
  private spotType: SpotType;
  private isOccupied: boolean;
}

class ParkingTicket {
  private ticketNumber: string;
  private entryTime: Date;
  private allocatedSpotId: string;
  private licensePlate: string;
}`
  );

  const [relationships, setRelationships] = useState<string>(
    initialValues?.relationships ||
      `- ParkingLot 1 -- * ParkingLevel (Composition)
- ParkingLevel 1 -- * ParkingSpot (Composition)
- ParkingLot --> SpotAllocationStrategy (Dependency Inversion)
- ParkingLot --> PricingStrategy (Dependency Inversion)
- HourlyPricingStrategy ..|> PricingStrategy (Realization)`
  );

  const [flows, setFlows] = useState<string>(
    initialValues?.flows ||
      `Flow 1: Vehicle Entry
1. Vehicle approaches entry gate sensor.
2. EntryPanel calls ParkingLot.entry(vehicle).
3. SpotAllocationStrategy finds nearest compatible free spot.
4. Spot is marked OCCUPIED in an atomic transaction.
5. ParkingTicket is generated and printed. Gate arm opens.

Flow 2: Vehicle Exit & Payment
1. Driver presents ticket at exit gate.
2. System computes duration = now - ticket.entryTime.
3. PricingStrategy.calculateFee(duration, vehicleType) computes cost.
4. Upon successful payment verification, spot is freed and gate opens.`
  );

  const [designExplanation, setDesignExplanation] = useState<string>(
    initialValues?.designExplanation ||
      `Design Choices & Trade-offs:
1. Single Responsibility Principle (SRP): Split fee calculation and spot allocation away from ParkingLot. ParkingLot only coordinates high-level workflows.
2. Strategy Pattern: Allows swapping between HourlyPricingStrategy and SurgePricingStrategy without changing core ParkingLot logic.
3. Thread Safety: Used optimistic concurrency or mutex locks when claiming a spot to prevent double-booking at high-throughput entrances.`
  );

  const [mermaidDiagram, setMermaidDiagram] = useState<string>(
    initialValues?.mermaidDiagram ||
      `classDiagram
class ParkingLot {
  -List~ParkingLevel~ levels
  -PricingStrategy pricingStrategy
  -SpotAllocationStrategy allocationStrategy
  +entry(Vehicle v) ParkingTicket
  +exit(ParkingTicket t) PaymentReceipt
}

class PricingStrategy {
  <<interface>>
  +calculateFee(int duration, VehicleType type) double
}

class HourlyPricingStrategy {
  +calculateFee(int duration, VehicleType type) double
}

class ParkingSpot {
  -String spotId
  -SpotType type
  -boolean isOccupied
  +occupy()
  +vacate()
}

ParkingLot --> PricingStrategy : delegates pricing
HourlyPricingStrategy ..|> PricingStrategy : implements
ParkingLot *-- ParkingSpot : contains`
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTemplateLoad = () => {
    if (problemSlug === 'vending-machine') {
      setAssumptions('1. Machine accepts currency notes and coins.\n2. Product shelves are individually motorized.');
      setClasses(`interface VendingMachineState {
  insertMoney(amount: number): void;
  selectProduct(code: string): void;
  dispense(): Item;
  cancel(): number;
}

class IdleState implements VendingMachineState { /* ... */ }
class HasMoneyState implements VendingMachineState { /* ... */ }
class DispenseState implements VendingMachineState { /* ... */ }

class VendingMachine {
  private currentState: VendingMachineState;
  private inventory: Map<string, Rack>;
  private coinInventory: CoinInventory;
}`);
      setRelationships('VendingMachine o-- VendingMachineState (State Pattern)\nIdleState ..|> VendingMachineState');
      setFlows('1. User inserts currency -> HasMoneyState.\n2. User presses code -> validates inventory -> transitions to DispenseState.\n3. Dispenses item and returns excess change.');
      setDesignExplanation('Applied GoF State Pattern to eliminate complex switch cases and guarantee safe lifecycle state transitions.');
      setMermaidDiagram(`classDiagram
class VendingMachine {
  -VendingMachineState currentState
  +setState(VendingMachineState state)
  +insertCoin(double amount)
}
class VendingMachineState {
  <<interface>>
  +insertMoney()
  +selectProduct()
  +dispense()
}
class IdleState {
  +insertMoney()
}
class DispenseState {
  +dispense()
}
VendingMachine --> VendingMachineState
IdleState ..|> VendingMachineState
DispenseState ..|> VendingMachineState`);
    } else if (problemSlug === 'elevator-system') {
      setAssumptions('1. N elevator cars across M floors.\n2. Each car has weight sensor and door interlock safety.');
      setClasses(`interface DispatchStrategy {
  selectBestCar(cars: ElevatorCar[], request: HallRequest): ElevatorCar;
}

class ElevatorCar {
  private id: number;
  private currentFloor: number;
  private direction: Direction;
  private state: CarState;
}

class ElevatorController {
  private cars: ElevatorCar[];
  private dispatchStrategy: DispatchStrategy;
}`);
      setRelationships('ElevatorController --> DispatchStrategy (Strategy Pattern)\nElevatorController 1 -- * ElevatorCar');
      setFlows('1. Passenger presses hall button (Floor 5 UP).\n2. ElevatorController queries DispatchStrategy to select closest car moving UP.\n3. Target car adds floor 5 to its request priority queue.');
      setDesignExplanation('Strategy Pattern enables plugging LOOK/SCAN or nearest car algorithms based on building traffic patterns.');
      setMermaidDiagram(`classDiagram
class ElevatorController {
  -List~ElevatorCar~ cars
  -DispatchStrategy strategy
  +handleHallRequest(int floor, Direction dir)
}
class DispatchStrategy {
  <<interface>>
  +selectBestCar(List cars, Request req) ElevatorCar
}
class ScanAlgorithm {
  +selectBestCar(List cars, Request req) ElevatorCar
}
ElevatorController --> DispatchStrategy
ScanAlgorithm ..|> DispatchStrategy`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assumptions.trim().length < 10) {
      setValidationError('Assumptions must be at least 10 characters.');
      setActiveTab('assumptions');
      return;
    }
    if (classes.trim().length < 20) {
      setValidationError('Classes & Responsibilities must be at least 20 characters.');
      setActiveTab('classes');
      return;
    }
    if (relationships.trim().length < 10) {
      setValidationError('Relationships must be at least 10 characters.');
      setActiveTab('relationships');
      return;
    }
    if (flows.trim().length < 15) {
      setValidationError('Key Flows must be at least 15 characters.');
      setActiveTab('flows');
      return;
    }
    if (designExplanation.trim().length < 20) {
      setValidationError('Design Explanation must be at least 20 characters.');
      setActiveTab('explanation');
      return;
    }

    setValidationError(null);
    onSubmit({
      assumptions,
      classes,
      relationships,
      flows,
      designExplanation,
      mermaidDiagram,
    });
  };

  const tabs = [
    { id: 'classes', label: 'Classes & SRP', icon: Boxes },
    { id: 'relationships', label: 'Relationships', icon: Network },
    { id: 'flows', label: 'Key Flows', icon: GitFork },
    { id: 'explanation', label: 'Trade-offs', icon: Scale },
    { id: 'assumptions', label: 'Assumptions', icon: FileText },
    { id: 'mermaid', label: 'Mermaid UML', icon: Sparkles },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl shadow-subtle overflow-hidden">
      {/* Workbench Header */}
      <div className="px-6 py-3.5 bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-ink)] tracking-tight">
            Design Studio Workspace
          </h2>
          <p className="text-[11px] text-[var(--color-ink-2)]">
            Input structured components for 6-dimension rubric evaluation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTemplateLoad}
            className="px-3 py-1.5 rounded-md bg-[var(--color-surface)] hover:bg-[var(--color-paper)] text-xs font-medium text-[var(--color-ink)] border border-[var(--color-rule)] flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Wand2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Load Schema</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-1.5 rounded-md shadow-subtle transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Submit Solution</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="px-6 py-2 bg-[var(--tint-rose)] border-b border-[var(--tint-rose-border)] text-[var(--tint-rose-text)] text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Segmented Tabs (Underline / Clean Hairline) */}
      <div className="flex overflow-x-auto border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] px-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-[var(--color-ink)] text-[var(--color-ink)] font-semibold bg-[var(--color-surface)]'
                  : 'border-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-2)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-surface)]">
        {activeTab === 'classes' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                Domain Classes, Attributes & Responsibilities
              </label>
              <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                Evaluated for SRP and Abstraction
              </span>
            </div>
            <textarea
              rows={16}
              value={classes}
              onChange={(e) => setClasses(e.target.value)}
              placeholder="Define classes, attributes, methods, and responsibilities. e.g. class ParkingLot { ... }"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs font-mono text-[var(--color-ink)] focus:outline-none transition-colors leading-relaxed shadow-inner"
            />
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                Relationships & Multiplicities
              </label>
              <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                Evaluated for Loose Coupling & Composition
              </span>
            </div>
            <textarea
              rows={16}
              value={relationships}
              onChange={(e) => setRelationships(e.target.value)}
              placeholder="Detail inheritance, composition, aggregation, and associations. e.g. ParkingLot 1 -- * ParkingSpot"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs font-mono text-[var(--color-ink)] focus:outline-none transition-colors leading-relaxed shadow-inner"
            />
          </div>
        )}

        {activeTab === 'flows' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                Key Execution Flows & Sequence Steps
              </label>
              <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                Evaluated for Requirements Coverage
              </span>
            </div>
            <textarea
              rows={16}
              value={flows}
              onChange={(e) => setFlows(e.target.value)}
              placeholder="Step-by-step sequence of interactions for core operations (e.g. entry, checkout, failure modes)..."
              className="w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs font-mono text-[var(--color-ink)] focus:outline-none transition-colors leading-relaxed shadow-inner"
            />
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                Design Decisions, Patterns & Trade-offs
              </label>
              <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                Evaluated for Rationale & Alternatives
              </span>
            </div>
            <textarea
              rows={16}
              value={designExplanation}
              onChange={(e) => setDesignExplanation(e.target.value)}
              placeholder="Explain why you chose certain design patterns, how you handle concurrency, and what trade-offs were made..."
              className="w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs text-[var(--color-ink)] focus:outline-none transition-colors leading-relaxed shadow-inner"
            />
          </div>
        )}

        {activeTab === 'assumptions' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                Assumptions & Operational Scope
              </label>
              <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                Scoping and Boundary Setting
              </span>
            </div>
            <textarea
              rows={16}
              value={assumptions}
              onChange={(e) => setAssumptions(e.target.value)}
              placeholder="Document your domain assumptions, bounds, capacity expectations, and scope limitations..."
              className="w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs text-[var(--color-ink)] focus:outline-none transition-colors leading-relaxed shadow-inner"
            />
          </div>
        )}

        {activeTab === 'mermaid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full min-h-[460px]">
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-bold text-[var(--color-ink)]">
                  Mermaid Class Diagram Code
                </label>
                <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
                  classDiagram
                </span>
              </div>
              <textarea
                value={mermaidDiagram}
                onChange={(e) => setMermaidDiagram(e.target.value)}
                placeholder="classDiagram&#10;class ParkingLot {&#10;  +parkVehicle()&#10;}"
                className="flex-1 w-full bg-[var(--color-surface)] border border-[var(--color-rule)] focus:border-[var(--color-focus)] focus:ring-1 focus:ring-[var(--color-focus)] rounded-md p-4 text-xs font-mono text-[var(--color-ink)] focus:outline-none transition-colors min-h-[380px] shadow-inner"
              />
            </div>

            <div className="h-full">
              <MermaidPreview code={mermaidDiagram} />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
