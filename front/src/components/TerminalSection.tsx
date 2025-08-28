import React from 'react';
import { FaTerminal, FaRust, FaDownload, FaCode } from 'react-icons/fa';

export const TerminalSection: React.FC = () => {
  return (
    <section id="terminal-app" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-black rounded-full">
              <FaTerminal className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Terminal App (Working)
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of SummarizeYT directly in your terminal. Built with Rust and Ratatui for maximum performance and a native terminal experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-black rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="font-mono text-green-400 text-sm space-y-2">
              <div>$ summarize-yt --help</div>
              <div className="text-gray-400">Usage: summarize-yt [OPTIONS] &lt;URL&gt;</div>
              <div className="text-gray-400">Options:</div>
              <div className="text-gray-400">  --summary     Generate AI summary</div>
              <div className="text-gray-400">  --flashcards  Create study flashcards</div>
              <div className="text-gray-400">  --export      Export to markdown/PDF</div>
              <div className="text-gray-400">  --help        Print help</div>
              <div className="text-gray-400">  --version     Print version</div>
              <div className="mt-4">$ summarize-yt https://youtube.com/watch?v=...</div>
              <div className="text-blue-400">📹 Extracting subtitles...</div>
              <div className="text-blue-400">🤖 Generating summary...</div>
              <div className="text-green-400">✅ Summary saved to output.md</div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaRust className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Built with Rust</h3>
                <p className="text-gray-600">
                  Lightning-fast performance with memory safety and zero-cost abstractions. Perfect for processing large video transcripts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaTerminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Native Terminal UI</h3>
                <p className="text-gray-600">
                  Beautiful terminal interface built with Ratatui. Rich text formatting, progress bars, and interactive elements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">CLI First</h3>
                <p className="text-gray-600">
                  Designed for developers and power users. Integrate into your workflows, scripts, and automation pipelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaDownload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Installation</h3>
                <p className="text-gray-600">
                  Single binary distribution. No dependencies, no runtime requirements. Just download and run.
                </p>
              </div>
            </div>
          </div>
        </div>

  
        <div className="mt-16 bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Installation</h3>
          <div className="bg-black rounded-lg p-3 sm:p-4 lg:p-6 font-mono text-xs sm:text-sm overflow-x-auto">
            <div className="text-green-400"># Clone the repository</div>
            <div className="text-gray-300 break-all sm:break-normal">git clone https://github.com/javiermedinaj/summarize-yt.git</div>
            <div className="text-gray-300">cd summarize-yt</div>
            <div className="text-green-400 mt-4"># Prerequisites: Install Rust and Cargo</div>
            <div className="text-gray-300 break-all sm:break-normal">curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh</div>
            <div className="text-gray-300">source ~/.cargo/env</div>
            <div className="text-green-400 mt-4"># Build and run</div>
            <div className="text-gray-300">cargo build --release</div>
            <div className="text-gray-300 break-all sm:break-normal">cargo run -- https://youtube.com/watch?v=dQw4w9WgXcQ</div>
            <div className="text-green-400 mt-4"># Or install globally</div>
            <div className="text-gray-300">cargo install --path .</div>
          </div>
          <div className="mt-4 text-center">
            <a 
              href="https://github.com/javiermedinaj?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              <FaCode className="w-4 h-4" />
              View all repositories →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
