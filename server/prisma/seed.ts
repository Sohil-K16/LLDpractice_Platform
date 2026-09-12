import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LLD Practice Platform database...');

  // 1. Demo User
  const demoUser = await prisma.user.upsert({
    where: { id: 'demo-user-001' },
    update: {},
    create: {
      id: 'demo-user-001',
      name: 'Alex Developer',
      email: 'alex@example.com',
    },
  });

  // 2. Problem: Parking Lot
  await prisma.problem.upsert({
    where: { slug: 'parking-lot' },
    update: {},
    create: {
      title: 'Design a Parking Lot System',
      slug: 'parking-lot',
      difficulty: 'Medium',
      description:
        'Design a comprehensive Low-Level Object-Oriented system for an automated multi-level parking lot facility. The system must coordinate vehicles entering and exiting, allocate optimal spots, generate timestamped tickets, and compute fees according to dynamic or hourly billing strategies.',
      requirements: JSON.stringify([
        'Support multiple parking levels and spots categorized by vehicle size (Compact, Large, Motorcycle, Handicapped).',
        'Accommodate distinct vehicle categories: Motorcycle, Car, Van, and Truck/Bus.',
        'Issue a unique parking ticket upon entry recording entry time, assigned spot, and vehicle license plate.',
        'Calculate parking charges at exit based on duration, spot type, and configurable pricing policy.',
        'Real-time display boards at each entrance showing vacant spot availability per vehicle type.',
        'Support concurrent entry/exit operations without double-allocating spots.',
      ]),
      constraints: JSON.stringify([
        'Thread-safe spot reservation: two vehicles entering at the same millisecond must not receive the same spot.',
        'Extensible pricing policy: easily plug in hourly rates, flat rates, weekday vs weekend surge pricing.',
        'Graceful rejection when the facility or a specific vehicle tier is at maximum capacity.',
      ]),
      concepts: JSON.stringify([
        'Strategy Pattern (PricingStrategy, SpotAssignmentStrategy)',
        'Factory Pattern (VehicleFactory, TicketFactory)',
        'Singleton Pattern (ParkingLot controller / registry)',
        'Observer Pattern (Availability display boards)',
      ]),
      hints: JSON.stringify([
        'Avoid making ParkingLot responsible for both spot allocation and payment computation (violates SRP).',
        'Encapsulate vehicle dimensions and parking spot sizes using clean enumerations and compatibility matrices.',
        'Think about how payment processing is decoupled from ticket lifecycle management.',
      ]),
    },
  });

  // 3. Problem: Vending Machine
  await prisma.problem.upsert({
    where: { slug: 'vending-machine' },
    update: {},
    create: {
      title: 'Design a Vending Machine System',
      slug: 'vending-machine',
      difficulty: 'Easy/Medium',
      description:
        'Design an object-oriented vending machine that allows users to select products, deposit cash/coins, dispenses selected items, computes and dispenses correct change, and manages out-of-stock and cancel scenarios seamlessly.',
      requirements: JSON.stringify([
        'Maintain inventory of items across multiple shelves/racks with item codes, prices, and stock counts.',
        'Accept denominations of coins and notes, accumulating balance during an active session.',
        'Dispense item if customer balance is greater than or equal to the item price and item is in stock.',
        'Return exact change to the customer using available coin/note reserves.',
        'Allow the customer to cancel transaction at any point before item dispense and receive a full refund of deposited money.',
        'Support admin/technician operations: restocking items and collecting/replenishing cash reserves.',
      ]),
      constraints: JSON.stringify([
        'Machine state transitions must be rigorously controlled: cannot dispense before payment or during maintenance.',
        'Transactional integrity: if change cannot be made or item fails to drop, rollback money collection.',
        'Inventory counts must decrease strictly when dispense succeeds.',
      ]),
      concepts: JSON.stringify([
        'State Pattern (IdleState, HasMoneyState, DispenseState, SoldOutState)',
        'Command Pattern (SelectProductCommand, InsertCoinCommand, CancelCommand)',
        'Chain of Responsibility / Greedy Strategy (Change dispensation algorithm)',
      ]),
      hints: JSON.stringify([
        'Use the State Pattern to avoid messy if-else or switch ladders across button press and coin insertion events.',
        'Separate the money vault / coin register logic from the product shelf inventory.',
      ]),
    },
  });

  // 4. Problem: Elevator Management System
  await prisma.problem.upsert({
    where: { slug: 'elevator-system' },
    update: {},
    create: {
      title: 'Design an Elevator Management System',
      slug: 'elevator-system',
      difficulty: 'Medium',
      description:
        'Design a multi-elevator scheduling and control system for a modern commercial high-rise building. The system must dispatch elevator cars efficiently responding to internal destination button presses and external hall call requests (UP/DOWN).',
      requirements: JSON.stringify([
        'Coordinate a bank of multiple elevator cars across N building floors.',
        'Handle external requests: hall buttons on each floor with UP and DOWN requests.',
        'Handle internal requests: destination floor buttons selected inside an elevator car.',
        'Elevator cars report real-time status: current floor, moving direction (UP, DOWN, IDLE), door status (OPEN, CLOSED), and load weight.',
        'Implement an optimal dispatch algorithm (such as LOOK / SCAN or nearest car heuristic) to minimize waiting and transit times.',
        'Handle emergency stop triggers and overload alarm conditions.',
      ]),
      constraints: JSON.stringify([
        'Elevator must not reverse direction while passengers are waiting for destinations along the current direction.',
        'Overweight elevators must hold doors open and refuse movement until weight is reduced below safe threshold.',
        'Support dynamic algorithm swapping (e.g. rush-hour mode vs night-saver mode).',
      ]),
      concepts: JSON.stringify([
        'Strategy Pattern (ElevatorDispatchStrategy: NearestCar, LOOK/SCAN algorithm)',
        'State Pattern (ElevatorState: Idle, MovingUp, MovingDown, DoorOpening, Maintenance)',
        'Observer Pattern (ElevatorController listening to button presses and car sensor updates)',
      ]),
      hints: JSON.stringify([
        'Decouple the elevator controller (dispatcher) from individual car motors and sensors.',
        'Represent upward and downward floor requests using priority queues or sorted trees for smooth direction sweeps.',
      ]),
    },
  });

  console.log('Database seeded successfully with demo user and 3 classic LLD problems!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
