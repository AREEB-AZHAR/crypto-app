import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, EyeOff, GitMerge, Wallet, Terminal, 
  Lock, RefreshCw, CheckCircle, AlertTriangle, UserX, UserCheck
} from 'lucide-react';

// ==========================================
// CRYPTOGRAPHY UTILS
// ==========================================
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomHex(bytes = 16) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==========================================
// MERKLE TREE UTILS
// ==========================================
async function buildMerkleTree(leaves) {
  if (!leaves || leaves.length === 0) return [];
  
  let currentLevel = [...leaves];
  const tree = [currentLevel];
  
  // Pad to next power of 2 for simplicity if needed, but here we just duplicate last if odd
  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];
      const combined = await sha256(left + right);
      nextLevel.push(combined);
    }
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }
  return tree;
}

// ==========================================
// 1. TORNADO CASH SIMULATOR
// ==========================================
const TornadoSimulator = () => {
  const [logs, setLogs] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [spentNullifiers, setSpentNullifiers] = useState(new Set());
  const [merkleRoot, setMerkleRoot] = useState("0x00...00");
  
  // Local User State (Prover)
  const [localSecret, setLocalSecret] = useState("");
  const [localNullifier, setLocalNullifier] = useState("");
  const [localCommitment, setLocalCommitment] = useState("");
  const [localNullifierHash, setLocalNullifierHash] = useState("");

  const addLog = (msg, type = "info") => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleGenerateSecrets = async () => {
    const secret = generateRandomHex(8);
    const nullifier = generateRandomHex(8);
    const commitment = await sha256(secret + nullifier);
    const nullifierHash = await sha256(nullifier);
    
    setLocalSecret(secret);
    setLocalNullifier(nullifier);
    setLocalCommitment(commitment);
    setLocalNullifierHash(nullifierHash);
    addLog("Local secrets and hashes generated (Not shared with contract).", "info");
  };

  const handleDeposit = async () => {
    if (!localCommitment) return addLog("Generate secrets first!", "error");
    if (commitments.includes(localCommitment)) return addLog("Commitment already in pool!", "error");

    const newCommitments = [...commitments, localCommitment];
    setCommitments(newCommitments);
    
    const tree = await buildMerkleTree(newCommitments);
    setMerkleRoot(tree[tree.length - 1][0]);
    
    addLog(`Deposited 1 ETH. Commitment added: ${localCommitment.substring(0,8)}...`, "success");
  };

  const handleWithdraw = async () => {
    if (!localSecret || !localNullifier) return addLog("No local secrets found!", "error");
    
    addLog("Generating local ZKP...", "info");
    
    // Prover checks if they know the secret by re-creating the commitment locally
    const myCommitment = await sha256(localSecret + localNullifier);
    const myNullifierHash = await sha256(localNullifier);
    const isValid = commitments.includes(myCommitment);

    // Simulated Proof Payload (Sent to Verifier)
    const proofPayload = {
      zkpValid: isValid,
      nullifierHash: myNullifierHash,
      root: merkleRoot
    };

    // --- VERIFIER (Contract) LOGIC ---
    if (proofPayload.root !== merkleRoot) {
      return addLog("❌ Contract: Merkle root mismatch!", "error");
    }
    if (spentNullifiers.has(proofPayload.nullifierHash)) {
      return addLog("❌ Contract: Double Spend Detected!", "error");
    }
    if (!proofPayload.zkpValid) {
      return addLog("❌ Contract: Invalid Zero-Knowledge Proof!", "error");
    }

    setSpentNullifiers(new Set([...spentNullifiers, proofPayload.nullifierHash]));
    addLog("✅ Contract: ZKP Verified. 1 ETH Withdrawn anonymously.", "success");
  };

  const attackDoubleSpend = () => {
    addLog("Attempting double spend attack...", "error");
    handleWithdraw();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-10">
      <div className="space-y-6">
        {/* User Local Machine (Prover) */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-700 pb-2">
            <Lock className="text-blue-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Your Local Wallet (Prover)</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Secrets are generated and stored locally. The contract never sees them.
          </p>
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Secret (Never Shared)</label>
              <div className="bg-slate-900 text-slate-300 p-2 rounded text-sm font-mono break-all">{localSecret || "-"}</div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Nullifier (Never Shared)</label>
              <div className="bg-slate-900 text-slate-300 p-2 rounded text-sm font-mono break-all">{localNullifier || "-"}</div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Commitment (Sent on Deposit)</label>
              <div className="bg-blue-900/30 border border-blue-800 text-blue-300 p-2 rounded text-sm font-mono break-all">{localCommitment || "-"}</div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Nullifier Hash (Sent on Withdraw)</label>
              <div className="bg-purple-900/30 border border-purple-800 text-purple-300 p-2 rounded text-sm font-mono break-all">{localNullifierHash || "-"}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={handleGenerateSecrets} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded shadow transition-colors text-sm">
              Generate New Secrets
            </button>
            <button onClick={handleDeposit} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition-colors text-sm flex items-center">
              <Wallet size={16} className="mr-2"/> Deposit 1 ETH
            </button>
            <button onClick={handleWithdraw} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded shadow transition-colors text-sm flex items-center">
              <EyeOff size={16} className="mr-2"/> Anonymous Withdraw
            </button>
          </div>
        </div>

        {/* Attack Simulation */}
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-5 shadow-lg">
           <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-red-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Attack Simulations</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">Test network resilience against malicious actors.</p>
          <button onClick={attackDoubleSpend} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow transition-colors text-sm">
            Simulate Double Spend
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Smart Contract (Verifier) */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-700 pb-2">
            <GitMerge className="text-green-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Smart Contract (Verifier)</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="bg-slate-900 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase font-bold">Pool Balance</div>
                <div className="text-2xl font-bold text-green-400">{commitments.length - spentNullifiers.size} ETH</div>
             </div>
             <div className="bg-slate-900 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase font-bold">Anonymity Set</div>
                <div className="text-2xl font-bold text-blue-400">{commitments.length} Users</div>
             </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-500 uppercase font-bold">Current Merkle Root</label>
            <div className="bg-slate-900 text-slate-300 p-2 rounded text-sm font-mono break-all">{merkleRoot}</div>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-black border border-slate-700 rounded-xl p-0 shadow-lg overflow-hidden flex flex-col h-[26rem]">
          <div className="bg-slate-800 text-xs text-slate-400 p-2 flex items-center border-b border-slate-700">
            <Terminal size={14} className="mr-2"/> Event Logs
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-2 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className={`
                ${log.type === 'error' ? 'text-red-400' : ''}
                ${log.type === 'success' ? 'text-green-400' : ''}
                ${log.type === 'info' ? 'text-blue-300' : ''}
              `}>
                <span className="text-slate-600">[{log.time}]</span> {log.msg}
              </div>
            ))}
            {logs.length === 0 && <div className="text-slate-600 italic">Awaiting events...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PIN ZKP PROTOCOL
// ==========================================
const PinZKP = () => {
  const TARGET_PIN = "7392";
  const [logs, setLogs] = useState([]);
  const [proverType, setProverType] = useState('alice'); // 'alice' or 'eve'
  const [stats, setStats] = useState({ rounds: 0, passes: 0 });

  const addLog = (msg, type = "info") => {
    setLogs(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 50));
  };

  const runRound = async (isEve) => {
    const proverPin = isEve ? "0000" : TARGET_PIN;
    
    // Verifier Setup
    let fakePin = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    while (fakePin === TARGET_PIN) {
        fakePin = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    }
    
    const salt0 = generateRandomHex(8);
    const salt1 = generateRandomHex(8);
    const challengeBit = Math.random() > 0.5 ? 1 : 0;
    
    const c0 = await sha256(salt0 + (challengeBit === 0 ? TARGET_PIN : fakePin));
    const c1 = await sha256(salt1 + (challengeBit === 1 ? TARGET_PIN : fakePin));

    // Prover Response
    const guessC0 = await sha256(salt0 + proverPin);
    const guessC1 = await sha256(salt1 + proverPin);
    
    let response;
    if (guessC0 === c0) response = 0;
    else if (guessC1 === c1) response = 1;
    else response = Math.random() > 0.5 ? 1 : 0; // Guess randomly if cheating
    
    const passed = response === challengeBit;
    
    addLog(`Round: Verifier challenged. Prover responded ${response}. ${passed ? '✅ Passed' : '❌ Failed'}`, passed ? 'success' : 'error');
    
    return passed;
  };

  const handleSingleRound = async () => {
    const passed = await runRound(proverType === 'eve');
    setStats(s => ({ rounds: s.rounds + 1, passes: s.passes + (passed ? 1 : 0) }));
  };

  const handleHundredRounds = async () => {
    let passes = 0;
    addLog(`Running 100 rounds for ${proverType.toUpperCase()}...`, "info");
    for(let i=0; i<100; i++) {
        const passed = await runRound(proverType === 'eve');
        if (passed) passes++;
    }
    setStats(s => ({ rounds: s.rounds + 100, passes: s.passes + passes }));
    addLog(`Completed 100 rounds. Passed ${passes}/100.`, passes === 100 ? "success" : "error");
  };

  const reset = () => {
    setStats({ rounds: 0, passes: 0 });
    setLogs([]);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">Color-Blind Friend Protocol</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-3xl">
          Prove knowledge of the PIN (<span className="text-white font-mono">{TARGET_PIN}</span>) without revealing it. 
          The Verifier hashes the true PIN and a fake PIN with random salts. The Prover must identify which hash contains the true PIN.
        </p>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex-1 bg-slate-900 rounded-lg p-4 border border-slate-700">
             <div className="text-sm font-bold text-slate-500 uppercase mb-3">Select Prover</div>
             <div className="flex space-x-2">
                <button onClick={() => { setProverType('alice'); reset(); }} 
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded border ${proverType === 'alice' ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                  <UserCheck size={18} className="mr-2"/> Alice (Knows PIN)
                </button>
                <button onClick={() => { setProverType('eve'); reset(); }} 
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded border ${proverType === 'eve' ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                  <UserX size={18} className="mr-2"/> Eve (Guesses)
                </button>
             </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-lg p-4 border border-slate-700 flex flex-col justify-center items-center">
             <div className="text-sm font-bold text-slate-500 uppercase mb-1">Success Rate</div>
             <div className="text-3xl font-bold text-white">
               {stats.rounds > 0 ? ((stats.passes / stats.rounds) * 100).toFixed(1) : '0'}%
             </div>
             <div className="text-xs text-slate-400">{stats.passes} / {stats.rounds} rounds passed</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleSingleRound} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition-colors">
            Run 1 Round
          </button>
          <button onClick={handleHundredRounds} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded shadow transition-colors">
            Run 100 Rounds
          </button>
          <button onClick={reset} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded shadow transition-colors ml-auto">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black border border-slate-700 rounded-xl shadow-lg flex flex-col overflow-hidden min-h-[300px]">
         <div className="bg-slate-800 p-3 text-sm font-bold text-slate-400 border-b border-slate-700">Protocol Logs</div>
         <div className="p-4 overflow-y-auto flex-1 font-mono text-sm space-y-1">
            {logs.map((log) => (
               <div key={log.id} className={log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-slate-300'}>
                 {log.msg}
               </div>
            ))}
            {logs.length === 0 && <div className="text-slate-600 italic">No activity yet. Select a prover and run rounds.</div>}
         </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MERKLE TREE VISUALIZER
// ==========================================
const MerkleVisualizer = () => {
  const [leaves, setLeaves] = useState([]);
  const [hashedLeaves, setHashedLeaves] = useState([]);
  const [treeLevels, setTreeLevels] = useState([]);
  const [proof, setProof] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    // Initialize with 10 deposits
    const initialDeposits = Array.from({length: 10}, (_, i) => `User${i+1}_Coin`);
    setLeaves(initialDeposits);
    
    const initTree = async () => {
      const hashed = await Promise.all(initialDeposits.map(d => sha256(d)));
      
      // Pad to 16
      const padded = [...hashed];
      while (padded.length < 16) {
        padded.push(padded[padded.length - 1]);
      }
      
      setHashedLeaves(padded);
      const tree = await buildMerkleTree(padded);
      setTreeLevels(tree);
    };
    initTree();
  }, []);

  const generateProof = (index) => {
    if (treeLevels.length === 0) return;
    
    const newProof = [];
    let currentIndex = index;
    
    // Build proof path
    for (let level = 0; level < treeLevels.length - 1; level++) {
      const isRightNode = currentIndex % 2 !== 0;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
      const siblingHash = treeLevels[level][siblingIndex];
      
      newProof.push({
        hash: siblingHash,
        direction: isRightNode ? 'left' : 'right',
        level: level
      });
      
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    setSelectedIndex(index);
    setProof(newProof);
    setVerifyResult(null);
  };

  const verifyProof = async () => {
    if (!proof || selectedIndex === null) return;
    
    let currentHash = hashedLeaves[selectedIndex];
    
    for (const step of proof) {
      if (step.direction === 'right') {
         currentHash = await sha256(currentHash + step.hash);
      } else {
         currentHash = await sha256(step.hash + currentHash);
      }
    }
    
    const root = treeLevels[treeLevels.length - 1][0];
    setVerifyResult(currentHash === root);
  };

  const getPathIndices = (leafIndex) => {
    if (leafIndex === null) return { path: [], siblings: [] };
    const path = [];
    const siblings = [];
    let curr = leafIndex;
    for (let l = 0; l < treeLevels.length; l++) {
      path.push({ level: l, index: curr });
      const isRightNode = curr % 2 !== 0;
      const sibling = isRightNode ? curr - 1 : curr + 1;
      if (l < treeLevels.length - 1) {
         siblings.push({ level: l, index: sibling });
      }
      curr = Math.floor(curr / 2);
    }
    return { path, siblings };
  };

  const renderGraph = () => {
    if (treeLevels.length === 0) return null;
    const { path, siblings } = getPathIndices(selectedIndex);
    const isPath = (l, i) => path.some(p => p.level === l && p.index === i);
    const isSibling = (l, i) => siblings.some(s => s.level === l && s.index === i);

    const lines = [];
    const nodes = [];

    // Draw lines (edges) between parents and children
    for (let l = 1; l < treeLevels.length; l++) {
      const numNodes = treeLevels[l].length;
      for (let i = 0; i < numNodes; i++) {
        const px = (i + 0.5) * (1000 / numNodes);
        const py = 40 + (4 - l) * 70;
        const numChildren = treeLevels[l-1].length;
        const c1x = (i * 2 + 0.5) * (1000 / numChildren);
        const c2x = (i * 2 + 1 + 0.5) * (1000 / numChildren);
        const cy = 40 + (4 - (l - 1)) * 70;

        const strokeColor1 = (isPath(l, i) && isPath(l-1, i*2)) ? '#3b82f6' : '#334155';
        const strokeColor2 = (isPath(l, i) && isPath(l-1, i*2+1)) ? '#3b82f6' : '#334155';
        const sw1 = (isPath(l, i) && isPath(l-1, i*2)) ? '3' : '1.5';
        const sw2 = (isPath(l, i) && isPath(l-1, i*2+1)) ? '3' : '1.5';

        lines.push(<line key={`line-${l}-${i}-1`} x1={px} y1={py} x2={c1x} y2={cy} stroke={strokeColor1} strokeWidth={sw1} className="transition-all duration-500 ease-in-out"/>);
        lines.push(<line key={`line-${l}-${i}-2`} x1={px} y1={py} x2={c2x} y2={cy} stroke={strokeColor2} strokeWidth={sw2} className="transition-all duration-500 ease-in-out"/>);
      }
    }

    // Draw boxes (nodes)
    for (let l = 0; l < treeLevels.length; l++) {
      const numNodes = treeLevels[l].length;
      for (let i = 0; i < numNodes; i++) {
        const x = (i + 0.5) * (1000 / numNodes);
        const y = 40 + (4 - l) * 70;
        const hash = treeLevels[l][i];

        let fill = '#1e293b'; // slate-800
        let stroke = '#475569'; // slate-600
        let labelColor = '#94a3b8'; // slate-400
        
        if (isPath(l, i)) {
            fill = '#1e3a8a'; // blue-900
            stroke = '#3b82f6'; // blue-500
            labelColor = '#bfdbfe'; // blue-200
        } else if (isSibling(l, i)) {
            fill = '#4c1d95'; // purple-900
            stroke = '#a855f7'; // purple-500
            labelColor = '#e9d5ff'; // purple-200
        }

        nodes.push(
          <g key={`node-${l}-${i}`} onClick={() => l === 0 ? generateProof(i) : null} className={l === 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'transition-colors'}>
            <title>{l === 0 ? `Leaf ${i} (Click to generate proof)\nOriginal: ${leaves[i] || 'Padded'}\nHash: ${hash}` : `Level ${l}, Node ${i}\nHash: ${hash}`}</title>
            <rect x={x - 22} y={y - 12} width="44" height="24" rx="6" fill={fill} stroke={stroke} strokeWidth="2" className="transition-all duration-500 ease-in-out" />
            <text x={x} y={y + 3} fill={labelColor} fontSize="10" textAnchor="middle" fontFamily="monospace" className="pointer-events-none font-bold">
               {hash.substring(0, 4)}
            </text>
          </g>
        );
      }
    }

    return (
      <svg viewBox="0 0 1000 360" className="w-full h-auto bg-slate-950/50 rounded-xl border border-slate-700 shadow-inner">
        {lines}
        {nodes}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
         <div className="flex justify-between items-end mb-4">
            <div>
               <h2 className="text-xl font-bold text-white mb-2">Interactive Merkle Graph</h2>
               <p className="text-slate-400 text-sm">
                 10 user deposits padded to 16 leaves (bottom row). <strong className="text-white">Click any leaf</strong> to generate its Merkle proof.
               </p>
            </div>
            {treeLevels.length > 0 && (
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Merkle Root (Top Node)</div>
                <div className="font-mono text-green-400 text-xs bg-slate-900 p-2 rounded border border-slate-700">{treeLevels[treeLevels.length - 1][0]}</div>
              </div>
            )}
         </div>

         {/* Graph Legend */}
         <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-bold text-slate-400 uppercase bg-slate-900/50 p-3 rounded-lg border border-slate-700 w-fit">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-400 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Path to Root</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400 mr-2 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Sibling Hashes (Proof)</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded border border-slate-500 bg-slate-800 mr-2"></div> Unused Node</div>
         </div>

         {/* SVG Graph Canvas */}
         <div className="w-full relative overflow-hidden">
            {renderGraph()}
         </div>
      </div>

      {proof && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Generated Proof for Leaf {selectedIndex}</h3>
            <button onClick={verifyProof} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded shadow transition-colors font-bold flex items-center">
              Verify Proof <CheckCircle size={16} className="ml-2"/>
            </button>
          </div>
          
          {verifyResult !== null && (
            <div className={`p-4 rounded-lg mb-4 text-center font-bold flex items-center justify-center ${verifyResult ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-red-900/40 text-red-400 border border-red-800'}`}>
              {verifyResult ? <><CheckCircle className="mr-2" /> Proof Validated Successfully! Root matches.</> : <><AlertTriangle className="mr-2"/> Verification Failed!</>}
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Sibling Hashes Required (Bottom to Top)</div>
            {proof.map((p, i) => (
              <div key={i} className="flex items-center bg-slate-900 p-3 rounded border border-slate-700">
                <div className="w-16 text-xs text-slate-500">Level {p.level}</div>
                <div className={`w-16 text-xs font-bold ${p.direction === 'left' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {p.direction.toUpperCase()}
                </div>
                <div className="flex-1 font-mono text-xs text-slate-300 truncate">{p.hash}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('tornado');

  const tabs = [
    { id: 'tornado', label: 'Tornado Cash Sim', icon: ShieldCheck },
    { id: 'zkp', label: 'PIN Protocol', icon: EyeOff },
    { id: 'merkle', label: 'Merkle Tree', icon: GitMerge },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Privacy Preserving Architecture</h1>
          <p className="text-slate-400">Zero-Knowledge Proofs & Anonymity Sets Sandbox</p>
        </header>

        {/* Navigation */}
        <nav className="flex space-x-2 mb-6 bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-slate-700 text-white shadow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 min-h-[600px]">
          {activeTab === 'tornado' && <TornadoSimulator />}
          {activeTab === 'zkp' && <PinZKP />}
          {activeTab === 'merkle' && <MerkleVisualizer />}
        </main>

      </div>
    </div>
  );
}